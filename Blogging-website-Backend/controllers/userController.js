const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const getCurrentUser = async (req, res) => {
  //after authentication, email, password and hashed password and that we need to store in the request 

  const email = req.userEmail;
 //console.log('email', {email});

  const user = await User.findOne({email}).exec();
  if(!user){
    return res.status(404).json({message: "User Not Found"});
  }
  return res.status(200).json({user: user.toUserResponse()});

}

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  console.log('Received token:', token);

  if (!token) {
    return res.status(400).json({ message: "Invalid or missing token." });
  }

  try {
    const user = await User.findOne({ verificationToken: token }).exec();
    //console.log('User fetched:', user);
    
    if (!user) {
      // Check if the user is already verified by querying their email
      const alreadyVerifiedUser = await User.findOne({ verified: true, verificationToken: undefined }).exec();
      if (alreadyVerifiedUser) {
        return res.status(200).json({ message: "Email is already verified." });
      }
      return res.status(404).json({ message: "Invalid token or user not found." });
    }

    if (user.verified) {
      // If the email is already verified
      return res.status(200).json({ message: "Email is already verified." });
    }

    user.verified = true;
    user.verificationToken = undefined; //removing the token after verification;
    await user.save();

    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    //console.error('Error verifying email:', error);
    res.status(500).json({ message: "Error verifying email.", error });
  }
};


const userLogin = async (req, res) => {
const {user}  = req.body;

  //check if the user exists
  if (!user || !user.email || !user.password ) {
    return res.status(400).json({
      message: "Please enter all the fields"
    });
  }

  //since email is unique query and find out that user
  const loginUser = await User.findOne({
    email: user.email
  }).exec();

  if (!loginUser) {
    return res.status(404).json({
      message: "User Not Found"
    });
  }

  //If the email verified
  if (!loginUser.verified) {
    return res.status(403).json({ message: "Please verify your email to log in." });
  }

  //if the password matches 
  const match  = await bcrypt.compare(user.password, loginUser.password);
  if(!match) {
    return res.status(401).json({
      message: "Unauthorized: Wrong password"
    });
  }

  // Create the token
  const token = jwt.sign(
    { user: { id: loginUser.id, email: loginUser.email, password: loginUser.password } },
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

  const {user} = req.body;

  //check if the data exists

  //console.log('user-email: ', user.email);

  if (!user || !user.email || !user.password || !user.username) {
    return res.status(400).json({
      message: "Please enter all the fields",
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

    // Send verification email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const verificationLink = `http://localhost:3000/api/verify?token=${verificationToken}`;
    await transporter.sendMail({
      from: '"Writely" Writely41@gmail.com',
      to: user.email,
      subject: "Email Verification",
      html: `<p>Welcome ${user.username},</p>
              <p>Please verify your email by clicking the link below:</p>
              <a href="${verificationLink}">Verify Email</a>`
    });

    res.status(201).json({ message: "Registration successful! Check your email for verification.", token: {verificationToken} });
  } catch (error) {
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

const updateUser = async (req,res) => {

  const {user} = req.body;

  if(!user){
    return res.status(400).json({message: "Required a User object"});
  }

  const email = req.userEmail;

  const target = await User.findOne({email}).exec();

  if(user.email){
    target.email = user.email;
  }

  if(user.username){
    target.username = user.username;
  }

  if(user.password){
    const hashedPass = await bcrypt.hash(user.password,10);
    target.password = hashedPass;
  }

  if(typeof user.image !== 'undefined'){
    target.image = user.image;
  }

  if(typeof user.bio !== 'undefined'){
    target.bio = user.bio;
  }

  await target.save();
  return res.status(200).json({
    user: target.toUserResponse()
  });

}

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
  verifyEmail
};

