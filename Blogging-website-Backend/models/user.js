const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//each of the field ensures that the mongoDB documents adhere to this
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "is valid"],
    index: true, //for optimizing the query performance
  },
  bio: {
    type: String,
  },
  image: {
    type: String,
  },
});

userSchema.methods.generateAcessToken = function () {
  const accessToken = jwt.sign(
    {
      user: {
        id: this._id,
        email: this.email,
        password: this.password,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return accessToken;
};

userSchema.methods.toUserResponse = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generateAcessToken(),
  };
};

userSchema.methods.updateProfile = function (bio, image) {
  this.bio = bio;
  this.image = image;
  return this.save(); // returns a promise
};

userSchema.methods.toProfileJSON = function (user) {
  return {
    username: this.username,
    bio:this.bio,
    image: this.image,
    // following:10
  };
};




module.exports = mongoose.model("User", userSchema);
