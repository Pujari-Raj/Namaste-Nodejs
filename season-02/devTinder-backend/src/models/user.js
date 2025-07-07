const mongoose = require("mongoose");
const validator = require("validator");
const jwtToken = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
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
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Weak Password!!");
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

// Make sure index is defined in schema itself
userSchema.index({ emailId: 1 }, { unique: true });

//mongoose schema methods

userSchema.methods.getJWT = async function () {
  // getting user
  const user = this;
  console.log("user -in-model", user);

  // Create JWT Token
  const token = await jwtToken.sign({ _id: user._id }, "SOUTH-DEV-TINDER", {
    expiresIn: "1h",
  });

  return token;
};


const UserModel = mongoose.model("User", userSchema);


module.exports = UserModel;
