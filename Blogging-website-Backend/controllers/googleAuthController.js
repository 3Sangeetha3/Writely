const { OAuth2Client } = require('google-auth-library');
const User = require('../models/user'); // Adjust path if needed
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ message: 'No credential provided' });
  }

  try {
    console.log('Using Google Client ID:', process.env.GOOGLE_CLIENT_ID);
    console.log('Credential received:', credential?.slice(0, 30));
    // 1. Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // 2. Find or create user in your DB
    let user = await User.findOne({ email: payload.email });
    if (!user) {
      user = await User.create({
        username: payload.name,
        email: payload.email,
        avatar: payload.picture,
        googleId: payload.sub,
        isGoogleUser: true
      });
    }

    // 3. Create your own JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '7d' }
    );

    // 4. Send user and token to frontend
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
      token,
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(401).json({ message: 'Invalid Google token' });
  }
};

module.exports = {
  googleLogin
}