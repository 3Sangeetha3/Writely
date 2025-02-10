const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

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
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
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

  const userObject = {
    username: user.username,
    email: user.email,
    password: hashedpass,
    verificationToken,
    // image: user.image,
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
            <a href="https://imgbb.com/"><img src="https://i.ibb.co/JjQDW1B/logo.png" alt="logo" style="width: 60px; height: auto;   " ></a>
            <h1 style="color: #243635; font-size: 26px;">Welcome to Writely, ${user.username}!</h1>
          </div>
        
          <div style="background-color:#A8AFAF; padding: 10px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <p style="color: #243635; font-size: 16px; line-height: 1.6; text-align: center;">
              Please verify your email address to activate your account and get started. Click the button below to complete the process.
            </p>
            <div>
              <img src="https://i.ibb.co/NVpYnSD/secured-shopping-and-delivery-2.png"  alt="verify Email image" style="width: 600px; height: auto; display: inline-block; "/>
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
                  <a href="https://facebook.com" target="_blank" title="Follow us on Facebook">
                    <img 
                      src="https://i.ibb.co/xHmw5Pq/facebook-1.png" 
                      alt="Facebook Icon" 
                      style="width: 30px; height: 30px; display: block;" 
                    />
                  </a>
                </td>
                <td style="padding: 0 7px;">
                  <a href="https://instagram.com" target="_blank" title="Follow us on Instagram">
                    <img 
                      src="https://i.ibb.co/Qkyyz84/instagram.png" 
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
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ message: "Required a User object" });
  }

  const email = req.userEmail;

  const target = await User.findOne({ email }).exec();

  if (user.email) {
    target.email = user.email;
  }

  if (user.username) {
    target.username = user.username;
  }

  if (user.password) {
    const hashedPass = await bcrypt.hash(user.password, 10);
    target.password = hashedPass;
  }

  if (typeof user.image !== "undefined") {
    target.image = user.image;
  }

  if (typeof user.bio !== "undefined") {
    target.bio = user.bio;
  }

  await target.save();
  return res.status(200).json({
    user: target.toUserResponse(),
  });
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

module.exports = {
  registerUser,
  userLogin,
  getCurrentUser,
  updateUser,
  updateProfile,
  verifyEmail,
};
