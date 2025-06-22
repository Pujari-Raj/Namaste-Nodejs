const mongoose = require("mongoose");
const UserModel = require("../models/user"); 

// const connectToDB = async () => {
//     await mongoose.connect("mongodb+srv://basvarajpujari607:mggIsHwhae2SY9gn@pujari-basvaraj.kswbskn.mongodb.net/test-dev-tinder")
// }

// module.exports = connectToDB

const connectToDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://basvarajpujari607:mggIsHwhae2SY9gn@pujari-basvaraj.kswbskn.mongodb.net/test-dev-tinder");
    // Very important: Sync indexes to ensure unique index is created
    await UserModel.syncIndexes();
    console.log("Indexes synced successfully");

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);  // Exit the process if DB connection fails
  }
};

module.exports = connectToDB;
