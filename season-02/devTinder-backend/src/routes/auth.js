const express = require("express");
const { validateSignUpData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user");

//
const authRouter = express.Router();

// signup user
authRouter.post("/signup", async (req, res) => {
  // console.log("request", req?.body);

  try {
    // validation of data
    validateSignUpData(req);

    //
    const { firstName, lastName, emailId, password } = req.body;

    // encrypting user password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("passwordHash", passwordHash);

    const user = new UserModel({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.status(200).send("user Added successfully");
  } catch (error) {
    // console.log("error adding user", error);
    // res.status(400).send("error adding user"+error.message);
    // Send proper error message if duplicate key error
    if (error.code === 11000) {
      res.status(400).send("Duplicate email: This email already exists");
    } else {
      res.status(400).send("ERROR : " + error.message);
    }
  }
});

// login user

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || emailId.trim() === "") {
      res.status(400).send("Email is required");
    }

    // checking whether user exists in our DB
    const user = await UserModel.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid Creds");
    }

    // validating password (checking the password enetred by user and in database)
    const ispasswordValid = await bcrypt.compare(password, user.password);

    if (!ispasswordValid) {
      // Create JWT Token
      // const token = await jwtToken.sign({ _id: user._id }, "SOUTH-DEV-TINDER", {
      //   expiresIn: "1h",
      // });
      throw new Error("Invalid Creds");
    }
    const token = await user.getJWT();

    if (!token) {
      return res.status(500).send("Token generation failed");
    }

    // Add token to cookie and send the response back to the user
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      httpOnly: true,
    });
    res.status(200).send("User Logged In Successfully");
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

// logout user

authRouter.post("/logout", async(req, res) => {
  // making the token null
  res.cookie("token", null , {
    expires: new Date(Date.now()),
  })

  res.send("logged out Successfully")
})

module.exports = authRouter;