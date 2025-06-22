const validator = require("validator");

const validateSignUpData = (req) => {
  // destructuring req.body from req

  const { firstName, emailId, password } = req.body;

  if (!firstName || firstName.trim() === "") {
    throw new Error("FirstName is required");
  } else if (!emailId || emailId.trim() === "") {
    throw new Error("EmailId is required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email Id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a strong password");
  }
};

module.exports = {
  validateSignUpData,
};
