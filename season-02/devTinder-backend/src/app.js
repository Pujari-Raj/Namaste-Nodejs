const express = require("express");
const connectToDB = require("./config/database");
const UserModel = require("./models/user");

const app = express();

connectToDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(8080, () => {
      console.log("Server is successfully listening on port 8080.");
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
  });

app.post("/signup", async (req, res) => {
  const user = new UserModel({
    firstName: 'javagal',
    lastName: 'shrinath',
    age: 'forty-five',
    gender: 'male',
    emailId: 'king@gmail.com',
    password: 'KingOfCricket@18'
  })

  try{
    await user.save();
    res.status(200).send('user Added successfully');
  }catch(error) {
    console.log("error adding user",error);
    res.status(400).send("error adding user",error);
  }
});
