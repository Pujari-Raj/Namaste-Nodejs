const express = require("express");
const UserModel = require("../models/user");
const { userAuth } = require("../middlewares/auth");

//
const profileRouter = express.Router();

// using userAuth middleware
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    // getting userData from request body from auth
    const userData = req.user;
    res.send(userData);
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

module.exports = profileRouter;