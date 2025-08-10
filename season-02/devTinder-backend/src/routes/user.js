const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

// get only pending reuest
userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
  try {
    // getting user
    const loggedInUser = req.user;

    // getting connectionRequests
    const connectionRequests = await connectionRequest
      .find({
        toUserId: loggedInUser._id,
        status: "INTERESTED",
      })
      .populate("fromUserId", "firstName lastName age gender skills");

    // console.log("all -connectionRequests", connectionRequests);

    return res.status(200).json({
      success: true,
      messgae: "connection Requests fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    console.error("Error in fetching connection requests", error.message);
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong while fetching connection requests",
    });
  }
});

// get all accepted connection request list
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    // getting loggedInUser
    const loggedInUser = req.user;

    //creating DB Query to get only accepted connection requests
    const connectionRequests = await connectionRequest
      .find({
        $or: [
          { toUserId: loggedInUser._id, status: "ACCEPTED" },
          { fromUserId: loggedInUser._id, status: "ACCEPTED" },
        ],
      })
      .populate("fromUserId", "firstName lastName age gender")
      .populate("toUserId", "firstName lastName age gender");

    console.log("connectionRequests", connectionRequests);

    // filtering data

    const filteredConnections = connectionRequests
      ?.map((user) => {
        if (user.fromUserId && user.toUserId) {
          // if loggedInUser is receiver, return sender
          if (user.toUserId._id.toString() === loggedInUser._id.toString()) {
            // console.log("inside-fromUserId");
            return user.fromUserId;
          } else {
            // if loggedInUser is sender, return receiver
            // console.log("inside-toUserId");
            return user.toUserId;
          }
        }
        return null;
      })
      .filter((user) => user != null)
      .filter(
        (user, index, self) =>
          index ===
          self.findIndex((u) => u._id.toString() === user._id.toString())
      );

    // if there is no connectionRequests
    if (filteredConnections.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No Connection Requests Found",
        data: [],
      });
    }

    // return all connectionRequests
    return res.status(200).json({
      success: true,
      messgae: "all connection Requests fetched successfully",
      data: filteredConnections,
    });
  } catch (error) {
    console.error("Error in fetching all connection requests", error.message);
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Something went wrong while fetching connection requests",
    });
  }
});

module.exports = userRouter;
