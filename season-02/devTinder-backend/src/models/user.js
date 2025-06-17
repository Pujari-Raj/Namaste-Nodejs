const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 5,
  },
  lastName: {
    type: String,
    maxLength: 50,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
    timestamps: true
});

// Make sure index is defined in schema itself
userSchema.index({ emailId: 1 }, { unique: true });

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
