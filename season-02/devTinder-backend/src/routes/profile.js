const express = require("express");
const UserModel = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateProfileData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const validator = require("validator");

//
const profileRouter = express.Router();

// using userAuth middleware
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    // getting userData from request body from auth
    const userData = req.user;
    res.status(200).json({
      success : true,
      message: "LoggedIn User Details",
      data : userData
    })
  } catch (err) {
    res.status(400).send("error-" + err.message);
  }
});

// get user by email
profileRouter.get("/getUserByEmail", async (req, res) => {
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
profileRouter.delete("/deleteUserById", async (req, res) => {
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
profileRouter.patch("/updateUserByEmail/:emailId", async (req, res) => {
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

// profile edit
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    // validating user data
    if (!validateProfileData(req)) {
      return res.status(400).send("Invalid Edit Request");
    }

    //getting loggedInUser
    const loggedInUser = req.user;
    console.log("loggedInUser-before", loggedInUser);
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    console.log("loggedInUser-after", loggedInUser);

    // storing new values of user in DB
    await loggedInUser.save();

    res.status(200).json({
      message: "Profile Updated Successfully",
      data: loggedInUser,
    });
  } catch (error) {
    // res.status(400).send("Something went wrong", error.message);
    // If the error is a Mongoose validation error (like skills > 5)
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors,
      });
    }

    // Catch-all for other unexpected errors
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
});

// forgot-password
profileRouter.patch("/profile/forgotpassword", userAuth, async (req, res) => {
  try {
    console.log("inside forgotpassword");

    const { currentPassword, newPassword } = req.body;

    console.log("currentPassword", currentPassword);
    console.log("newPassword", newPassword);

    //checking if fields are empty
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current and new passwords are required",
      });
    }

    // validating password strength
    if (!validator.isStrongPassword(newPassword)) {
      return res.status(401).json({
        success: false,
        message:
          "New password is too weak. Use at least 8 characters, including uppercase, lowercase, number, and symbol",
      });
    }

    // checking if currentPassword , newPassword is same
    // 3. Prevent setting same password
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the current password",
      });
    }

    //checking if current password is correct
    const user = req.user;

    const iscurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    console.log("iscurrentPasswordValid", iscurrentPasswordValid);

    if (!iscurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Current Password is incorrect",
      });
    }

    // taking new passowrd and hashing
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting password",
    });
  }
});

module.exports = profileRouter;
