require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const corsOptions = require("../config/corsOptions");

const connectDB = require("../config/dbConnect");

connectDB();

//user routes => /api/users and /api/user
app.use(cors(corsOptions));
app.use(express.json()); //middleware to parse json

// console.log(PORT)

// app.get('/', (req, res) => {
//     console.log("request recived");
//     // res.send('Helloworld');
//     res.status(200).json({
//         message: "hello world"
//     })
// })

//user routes => /api/users and /api/user

app.use("/api", require("../routes/userRoutes"));

// article routes 

app.use("/api/articles", require("../routes/articleRoutes"));

//tag routes
app.use("/api/tags", require("../routes/tagRoutes"));

//comment routes
app.use("/api/articles", require("../routes/commentRoutes"));

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log("Error while connection to MongoDB: ", err);
});
