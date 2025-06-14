const express = require("express");
const connectToDB = require("./config/database");
const UserModel = require("./models/user");

const app = express();

app.use(express.json())

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

  console.log('request',req?.body);
  
  const user = new UserModel(req.body);

  try{
    await user.save();
    res.status(200).send('user Added successfully');
  }catch(error) {
    console.log("error adding user",error);
    res.status(400).send("error adding user",error);
  }
});
