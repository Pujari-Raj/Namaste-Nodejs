// Routes for connectionRequest

const express = require("express");
const connectionRequestModel = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const UserModel = require("../models/user");

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
      const allowedStatusTypes = ["INTERESTED", "REJECTED"];
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
        return res.status(409).json({
          success: false,
          message:
            "A connection request already exists between you and this user.",
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
        message: "Connection Request sent successfully",
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

module.exports = connectionRequestRouter;
