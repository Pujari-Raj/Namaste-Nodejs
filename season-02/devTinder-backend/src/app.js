const express = require("express");
const connectToDB = require("./config/database");
const UserModel = require("./models/user");
const { validateSignUpData } = require("./utils/validations");
const bcrypt = require("bcrypt");
// for getting token
const cookieParser = require("cookie-parser");
const jwtToken = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

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

// signup user
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

    if (ispasswordValid) {
      // Create JWT Token
      const token = await jwtToken.sign({ _id: user._id }, "SOUTH-DEV-TINDER");

      // Add token to cookie and send the response back to the user
      res.cookie("token", token);
      res.status(200).send("User Logged In Successfully");
    } else {
      throw new Error("Invalid Creds");
    }
  } catch (error) {
    res.status(400).send("ERROR : " + error.message);
  }
});

//
// using userAuth middleware 
app.get("/profile", userAuth,async (req, res) => {
  try {
    // getting userData from request body from auth
    const userData = req.user
    res.send(userData);
  } catch (err) {
    res.status(400).send("error-"+err.message);
  }
});

// get user by email
app.get("/getUserByEmail", async (req, res) => {
  const userEmail = req?.body?.emailId;
  console.log(`userEmail`, userEmail);

  try {
    const user = await UserModel.findOne({ emailId: userEmail });
    console.log("user", user);

    if (!user) {
      res.status(400).send("User not Found!");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    console.log("error finding user", error);
    res.status(400).send("error getting user", error);
  }
});

// delete user by id
app.delete("/deleteUserById", async (req, res) => {
  const userId = req.body.userId;
  console.log(`userId`, userId);

  try {
    const user = await UserModel.findByIdAndDelete(userId);
    res.status(200).send("User Deleted!!!!");
  } catch (error) {
    res.status(400).send("something went wrong!!");
  }
});

// update user by emailId
app.patch("/updateUserByEmail/:emailId", async (req, res) => {
  const userEmail = req.params.emailId;
  const updateData = req.body;
  console.log(`updateData ${updateData}`);

  if (!userEmail) {
    return res.status(400).json({
      message: "Email ID is required as a query param",
    });
  }

  try {
    //
    const ALLOWED_UPDATES = ["gender", "password", "firstName", "lastName"];
    // const isUpdateAllowed = Object.keys(updateData).every((k) =>
    //   ALLOWED_UPDATES.includes(k)
    // )

    // if (!isUpdateAllowed) {
    //   throw new Error ('cannot update certain field')
    // }

    const updateFields = Object.keys(updateData);

    // Find disallowed fields
    const invalidFields = updateFields.filter(
      (field) => !ALLOWED_UPDATES.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "Invalid fields provided for update",
        restrictedFields: invalidFields,
      });
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { emailId: userEmail },
      { $set: updateData },
      { new: true }
    ).exec();

    console.log(`updatedUser- ${updatedUser}`);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found with provided email" });
    } else {
      res.status(200).json({
        message: "User updated successfully",
        updatedUser,
      });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Error updating user", error });
  }
});
