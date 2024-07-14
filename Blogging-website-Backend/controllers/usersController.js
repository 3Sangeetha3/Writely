const User = require("../models/user");
const bcrypt = require("bcrypt");


const userLogin = (req, res) => {
  res.status(200).send("user login");
};

const registerUser = async (req, res) => {
  //logic to register the user
  // console.log('registering the user')

  const user = req.body;

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

  const userObject = {
    username: user.username,
    email: user.email,
    password: hashedpass
  };

  //create a user

  const createdUser = await User.create(userObject);

  //save to the database
  //create a model or schema

  if(createdUser){
    res.status(201).json({
        user: createdUser.toUserResponse()
    })
  }else{
    res.status(422).json({
        errors: {
            body: "Unable to register the user"
        }
    })
  }

  //console.log('data', {data});
//   res.status(200).json({ createdUser });
};

module.exports = {
  registerUser,
  userLogin,
};
