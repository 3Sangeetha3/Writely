const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user'); // Adjust path if needed
const jwt = require('jsonwebtoken');
const axios = require('axios');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'avatars', resource_type: 'image' },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ message: 'No credential provided(email, name, ..)' });
  }

  try {
    //console.log('Using Google Client ID:', process.env.GOOGLE_CLIENT_ID);
    //console.log('Credential received:', credential?.slice(0, 30));

    // 1. Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Download and upload avatar to Cloudinary if it's a Google URL
    let avatarUrl = payload.picture;
    if (avatarUrl && avatarUrl.includes('googleusercontent.com')) {
      try {
        const response = await axios.get(avatarUrl, { responseType: 'arraybuffer' });
        avatarUrl = await uploadFromBuffer(response.data);
      } catch (err) {
        console.error('Failed to upload avatar to Cloudinary:', err);
        // fallback to Google URL if upload fails
      }
    }

    // 2. Find or create user in your DB
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        username: payload.name,
        email: payload.email,
        avatar: avatarUrl,
        googleId: payload.sub,
        isGoogleUser: true,
        verified: true, // Assuming Google users are verified
      });
      //console.log('New Google user created:', user.email);
    }else {
      // If user exists, ensure it's marked as a Google user and verified
      // This handles cases where a user might have registered traditionally
      // but then tries to log in with Google using the same email.
      if (!user.googleId) {
        user.googleId = payload.sub;
        user.isGoogleUser = true;
      }
      if(!user.verified) {
        user.verified = true; // Mark as verified if not already
      }
      // Update image if Google provides a new one or if yours is default
      if (avatarUrl && user.image !== avatarUrl) {
        user.image = avatarUrl;
      }
      await user.save(); // Save any updates
      //console.log('Existing Google user logged in:', user.email);
    }

    // 3. Create your own JWT using the user's toUserResponse() method
    // This ensures the JWT payload structure and the returned user object
    // match what your frontend (useAuth) and backend (verifyJWT) expect.
    const token = jwt.sign(
      { user: { id: user.id, email: user.email } },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const userResponse = user.toUserResponse();
    userResponse.token = token;

    // 4. Send the user object (which now includes the token) to the frontend
    res.status(200).json({
      user: userResponse,
      message: 'Google login successful!'
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ message: 'Invalid Google token or server error.' });
  }
};

module.exports = {
  googleLogin
}