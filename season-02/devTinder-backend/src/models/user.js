const mongoose = require("mongoose");
const validator = require("validator");

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
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid Email addrees format");
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Weak Password!!");
      }
    }
  },
}, {
    timestamps: true
});

// Make sure index is defined in schema itself
userSchema.index({ emailId: 1 }, { unique: true });

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
