const express = require("express");
const connectionRequestModel = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const UserModel = require("../models/user");
const { default: mongoose } = require("mongoose");

//
const connectionRequestRouter = express.Router();

connectionRequestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      // get the user details
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      // 1. adding validation for status
      const allowedStatusTypes = ["INTERESTED", "IGNORED"];
      if (!allowedStatusTypes.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status type: " + status,
        });
      }

      //2. Prevent sending request to yourself
      if (fromUserId.toString() === toUserId.toString()) {
        return res.status(400).json({
          success: false,
          message: "You cannot send a request to yourself.",
        });
      }

      //3. Check if target user exists
      const ifToUserExist = await UserModel.findById(toUserId);
      const toUserName = ifToUserExist?.firstName;
      if (!ifToUserExist) {
        return res.status(404).json({
          success: false,
          message: "The user you are trying to connect with does not exist.",
        });
      }

      //4. validation for cross sending the request Check for existing request (both directions)
      const existingRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      // 5. if all checks are passed then save the connectionRequest
      if (existingRequest) {
        // Case: There’s already an active or accepted connection
        if (["INTERESTED"].includes(existingRequest.status)) {
          return res.status(409).json({
            success: false,
            message:
              "A connection request already exists between you and this user.",
          });
        }

        // Case: retry after rejection -> updating record
        if (existingRequest.status === "REJECTED" && status === "INTERESTED") {
          existingRequest.status = "INTERESTED";
          await existingRequest.save();
          console.log("inside-rejction new");

          return res.status(200).json({
            success: true,
            message: "New request sent after previous rejection.",
            data: existingRequest,
          });
        }

        return res.status(400).json({
          success: false,
          message: `Cannot send request. Current status: ${existingRequest.status}`,
        });
      }

      // adding data
      const connectionRequest = new connectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });

      //
      const data = await connectionRequest.save();

      return res.status(200).json({
        success: true,
        // message: "Connection Request sent successfully",
        message: req.user.firstName + " sent request to " + toUserName,
        data,
      });
    } catch (error) {
      console.error("Error in connection request", error.message);
      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Something went wrong while sending connection request",
      });
    }
  }
);

// review-connectionRequest

connectionRequestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      //get value of status, requestId
      const status = req.params.status;
      const requestId = req.params.requestId;
      const currentUserId = req.user._id;

      //1.validating status types
      const allowedStatusTypes = ["ACCEPTED", "REJECTED"];

      if (!allowedStatusTypes.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Allowed statuses: ${allowedStatusTypes.join(
            ", "
          )}`,
        });
      }

      //2. validating ObjectId format
      if (!mongoose.Types.ObjectId.isValid(requestId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid connection request ID format.",
        });
      }

      // 3. Find connection Request
      const connectionRequest = await connectionRequestModel.findById(
        requestId
      );

      // 4. Check if request exists
      if (!connectionRequest) {
        return res.status(404).json({
          success: false,
          message: "Connection request not found.",
        });
      }

      //5. Ensuring current User is the receiver, bcz only the loggedInUser can accept/reject the connection request
      if (connectionRequest.toUserId.toString() !== currentUserId.toString()) {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to review this request.",
        });
      }

      //6. Checking if request is already reviwed
      if (allowedStatusTypes.includes(connectionRequest.status)) {
        return res.status(409).json({
          success: false,
          message: `This connection request was already ${connectionRequest.status.toLowerCase()}.`,
        });
      }

      // 7. updating status
      connectionRequest.status = status;

      connectionRequest.reviewdBy = currentUserId;

      const updatedRequest = await connectionRequest.save();

      return res.status(200).json({
        success: true,
        message: `Connection request ${status.toLowerCase()} successfully.`,
        data: updatedRequest,
      });
    } catch (error) {
      console.error("Error reviewing connection request", error.message);
      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Something went wrong while reviewing connection request",
      });
    }
  }
);

module.exports = connectionRequestRouter;
