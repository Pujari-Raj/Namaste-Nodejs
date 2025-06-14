const express = require("express");
const connectToDB = require("./config/database");
const UserModel = require("./models/user");

const app = express();

app.use(express.json());

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
  console.log("request", req?.body);

  const user = new UserModel(req.body);

  try {
    await user.save();
    res.status(200).send("user Added successfully");
  } catch (error) {
    console.log("error adding user", error);
    res.status(400).send("error adding user", error);
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
app.patch("/updateUserByEmail", async (req, res) => {
  const userEmail = req.query.emailId;
  const updateData = req.body;
  console.log(`updateData ${updateData}`);
  

  if (!userEmail) {
    return res.status(400).json({
      message: "Email ID is required as a query param",
    });
  }

  try {
    const updatedUser = await UserModel.findOneAndUpdate(
      { emailId: userEmail },
      { $set: updateData },
      {new: true}
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
