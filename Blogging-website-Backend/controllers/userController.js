const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { getRandomAvatar } = require("../helpers/defaultAvatars");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const Article = require("../models/Article");

const getCurrentUser = async (req, res) => {
  //after authentication, email, password and hashed password and that we need to store in the request

  const email = req.userEmail;
  //console.log('email', {email});

  const user = await User.findOne({ email }).exec();
  if (!user) {
    return res.status(404).json({ message: "User Not Found" });
  }
  return res.status(200).json({ user: user.toUserResponse() });
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  //console.log('Received token:', token);

  if (!token) {
    return res.status(400).json({ message: "Invalid or missing token." });
  }

  try {
    const user = await User.findOne({ verificationToken: token }).exec();
    //console.log('User fetched:', user);

    if (!user) {
      // Check if the user is already verified by querying their email
      const alreadyVerifiedUser = await User.findOne({
        verified: true,
        verificationToken: undefined,
      }).exec();
      if (alreadyVerifiedUser) {
        return res.status(200).json({ message: "Email is already verified." });
      }
      return res
        .status(404)
        .json({ message: "Invalid token or user not found." });
    }

    if (user.verified) {
      // If the email is already verified
      return res.status(200).json({ message: "Email is already verified." });
    }

    user.verified = true;
    user.verificationToken = undefined; //removing the token after verification;
    await user.save();

    const accessToken = jwt.sign(
      { user: { id: user.id, email: user.email } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({
      message: "Email verified successfully!",
      token: accessToken,
    });
  } catch (error) {
    //console.error('Error verifying email:', error);
    res.status(500).json({ message: "Error verifying email.", error });
  }
};

const userLogin = async (req, res) => {
  const { user } = req.body;

  //check if the user exists
  if (!user || !user.email || !user.password) {
    return res.status(400).json({
      message: "Please enter all the fields",
    });
  }

  //since email is unique query and find out that user
  const loginUser = await User.findOne({
    email: user.email,
  }).exec();

  if (!loginUser) {
    return res.status(404).json({
      message: "User Not Found",
    });
  }

  //If the email verified
  if (!loginUser.verified) {
    return res
      .status(403)
      .json({ message: "Please verify your email to log in." });
  }

  //if the password matches
  const match = await bcrypt.compare(user.password, loginUser.password);
  if (!match) {
    return res.status(401).json({
      message: "Unauthorized: Wrong password",
    });
  }

  // Create the token
  const token = jwt.sign(
    { user: { id: loginUser.id, email: loginUser.email } },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    user: loginUser.toUserResponse(),
    token,
  });
};

const registerUser = async (req, res) => {
  //logic to register the user
  // console.log('registering the user')
  const FRONTEND_URL = process.env.FRONTEND_URL;
  const { user } = req.body;

  //check if the data exists
  //console.log('user-email: ', user.email);

  if (!user || !user.email || !user.password || !user.username) {
    return res.status(400).json({
      message: "Please enter all the fields",
    });
  }

  // Check if a user with the given email already exists
  const existingUser = await User.findOne({ email: user.email });
  if (existingUser) {
    // If user exists but is not verified, inform the user to verify their email
    if (!existingUser.verified) {
      return res.status(403).json({
        message: "Please verify your email to complete registration.",
      });
    }
    // If the user exists and is verified, inform that the email is already in use
    return res.status(409).json({
      message: "Email is already registered.",
    });
  }
  //hash the password => hashing + salt (unique string)

  const hashedpass = await bcrypt.hash(user.password, 10); //10 => salt rounds
  // console.log('hashedpass', hashedpass);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const selectedAvatar =
    typeof user.image === "string" && user.image.trim().length > 0
      ? user.image
      : getRandomAvatar(user.pronouns);

  const userObject = {
    username: user.username,
    email: user.email,
    password: hashedpass,
    verificationToken,
    pronouns: user.pronouns,
    image: selectedAvatar,
    // bio: user.bio
  };

  //create a user

  try {
    const createdUser = await User.create(userObject);

    try {
      // Send verification email
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const verificationLink = `${FRONTEND_URL}/verify-email?token=${verificationToken}`;
      await transporter.sendMail({
        from: '"Writely" Writely41@gmail.com',
        to: user.email,
        subject: "Email Verification",
        html: `<div style="font-family: Arial, sans-serif; background-color: #FCFBF9; color: #001514; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center;">
            <a href="https://writely.3sangeetha3.tech/" style="text-decoration: none; color: #001514;">
            <img src="https://cdn.jsdelivr.net/gh/3Sangeetha3/writely-images-cdn@main/Email/WritelyLogo.png" alt="logo" style="width: 60px; height: auto; justify-items:center; " />
            </a>
            <h1 style="color: #243635; font-size: 26px;">Welcome to Writely, ${user.username}!</h1>
          </div>
        
          <div style="background-color:#A8AFAF; padding: 10px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <p style="color: #243635; font-size: 16px; line-height: 1.6; text-align: center;">
              Please verify your email address to activate your account and get started. Click the button below to complete the process.
            </p>
            <div>
              <img src="https://cdn.jsdelivr.net/gh/3Sangeetha3/writely-images-cdn@main/Email/verifyEmail.png"  alt="verify Email image" style="width: 600px; height: auto; margin: 0; display: block; "/>
            </div>
        
            <div style="text-align: center; margin: 20px 0;">
              <a href="${verificationLink}" style="display: inline-block; background-color: #001514; color: #E0E3E3; text-decoration: none; font-size: 16px; padding: 10px 20px; border-radius: 5px; font-weight: bold; transition: background-color 0.3s ease, transform 0.2s ease;">
                Verify Email
              </a>
            </div>
        
            <p style="color: #475756; font-size: 14px; text-align: center;">
              If you did not create an account, please ignore this email.
            </p>
          </div>
        
          <footer style="margin-top: 20px; text-align: center; color: #475756; font-size: 12px;">
            <p>© 2024 Writely. All rights reserved.</p>
        
            <table align="center" style="margin: 0 auto; text-align: center;">
              <tr>
                <td style="padding: 0 7px;">
                  <a href="https://cdn.jsdelivr.net/gh/3Sangeetha3/writely-images-cdn@main/Email/facebook.png" target="_blank" title="Follow us on Facebook">
                    <img 
                      src="https://cdn.jsdelivr.net/gh/3Sangeetha3/writely-images-cdn@main/Email/facebook.png" 
                      alt="Facebook Icon" 
                      style="width: 30px; height: 30px; display: block;" 
                    />
                  </a>
                </td>
                <td style="padding: 0 7px;">
                  <a href="https://cdn.jsdelivr.net/gh/3Sangeetha3/writely-images-cdn@main/Email/instagram.png" target="_blank" title="Follow us on Instagram">
                    <img 
                      src="https://cdn.jsdelivr.net/gh/3Sangeetha3/writely-images-cdn@main/Email/instagram.png" 
                      alt="Instagram Icon" 
                      style="width: 30px; height: 30px; display: block;" 
                    />
                  </a>
                </td>
              </tr>
          </table>
          </footer>
        </div>`,
      });
    } catch (mailError) {
      console.error("Error sending verification email:", mailError);
      // Optionally, you might still want to let the registration succeed
      // and instruct the user to request a new verification email later.
      //resend email
    }
    res.status(201).json({
      message: "Registration successful! Check your email for verification.",
      token: { verificationToken },
    });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Error registering user", error });
  }

  //save to the database
  //create a model or schema

  // if(createdUser){
  //   res.status(201).json({
  //       user: createdUser.toUserResponse()
  //   })
  // }else{
  //   res.status(422).json({
  //       errors: {
  //           body: "Unable to register the user"
  //       }
  //   })
  // }

  //console.log('data', {data});
  //   res.status(200).json({ createdUser });
};

const updateUser = async (req, res) => {
  try {
    // Parse the user data from the form-data
    let userData = typeof req.body.user === "string" ? JSON.parse(req.body.user) : req.body.user;
    // If parsing returns a string again, try parsing one more time (defensive)
    if (typeof userData === "string") {
      try {
        userData = JSON.parse(userData);
      } catch (error) {
        return res.status(400).json({ message: "Invalid JSON format in user field." });
      }
    }

    // Find the target user using the provided email
    const target = await User.findOne({ email: userData.email }).exec();
    if (!target) {
      return res.status(404).json({
        message: `User with email ${userData.email} not found to update.`,
      });
    }

    // If a new file was uploaded, process it with Cloudinary
    if (req.file) {
      // Delete previous Cloudinary image if it exists and is from Cloudinary
      if (target.image && target.image.includes("res.cloudinary.com")) {
        try {
          // Example URL: https://res.cloudinary.com/ds1ceummz/image/upload/v1612345678/profile_images/abc123.jpg
          const parts = target.image.split("/");
          const folderIndex = parts.findIndex((part) => part === "profile_images");
          if (folderIndex !== -1 && parts.length > folderIndex + 1) {
            let publicIdWithExt = parts[folderIndex] + "/" + parts[folderIndex + 1];
            // Remove the extension from publicId
            const dotIndex = publicIdWithExt.lastIndexOf(".");
            if (dotIndex !== -1) {
              publicIdWithExt = publicIdWithExt.substring(0, dotIndex);
            }
            await cloudinary.uploader.destroy(publicIdWithExt);
          }
        } catch (delError) {
          console.error("Error deleting previous image:", delError);
        }
      }

      // Upload the new image to Cloudinary
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "profile_images",
      });
      // Override the image URL with the new Cloudinary URL
      userData.image = uploadedImage.secure_url;
      // Delete the local file after uploading to Cloudinary
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("File deletion error:", err);
      });
    }

    // Update the target user's fields
    if (userData.username) {
      target.username = userData.username;
    }
    if (userData.email) {
      target.email = userData.email;
    }
    if (userData.password) {
      const hashedPass = await bcrypt.hash(userData.password, 10);
      target.password = hashedPass;
    }
    if (typeof userData.bio !== "undefined") {
      target.bio = userData.bio;
    }
    if (typeof userData.image === "string" && userData.image.trim().length > 0) {
      target.image = userData.image;
    }

    await target.save();
    return res.status(200).json({
      user: target.toUserResponse(),
      message: { message: "Profile updated successfully" },
    });
  } catch (error) {
    console.error("Error while updating the details: ", error);
    return res.status(500).json({ message: "Error updating user details." });
  }
};

const updateProfile = async (req, res) => {
  const { bio, image } = req.body;

  try {
    const email = req.userEmail;
    const user = await User.findOne({ email }).exec();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.updateProfile(bio, image); // Calling the method to update profile

    return res.status(200).json({
      user: user.toUserResponse(), // Return the updated user object
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating profile" });
  }
};

const getProfileByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).exec();

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const userId = user._id;
    // console.log("user id", userId);
    const articles = await Article.find({author: userId}).exec();
    
    // Return the profile data
    return res.status(200).json({
      profile: user.toProfileJSON(),
      articles: articles,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  registerUser,
  userLogin,
  getCurrentUser,
  updateUser,
  updateProfile,
  verifyEmail,
  getProfileByUsername,
};
