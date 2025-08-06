const mongoose = require("mongoose");
const validator = require("validator");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    toUserId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
    },
    // enum
    status: {
      type: String,
      required: true,
      enum: {
        values: ["IGNORED", "INTERESTED", "ACCEPTED", "REJECTED"],
        message: `{VALUE} is incorrect status type`,
      },
    },
  },
  {
    timestamps: true,
  }
);

/**
 * .pre() is a Mongoose middleware that allows you to run logic before a document is saved, queried, updated 
 * or removed from the database.
 * but in our case it is not ideal to add a pre method because:-
 * - You can't send proper HTTP error response
 * - You can't control status code or format
 */

// connectionRequestSchema.pre("save", function (next) {
//   const connectionRequest = this;
//   //
//   if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
//     throw new Error("Cannot send connection request to yourself!")
//   }

//   next();
// })

// adding index to connectionRequest table

// adding indexing in ascending order
connectionRequestSchema.index({fromUserId : 1, toUserId: 1})

const connectionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = connectionRequestModel