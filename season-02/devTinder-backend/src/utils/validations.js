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

//
const validateProfileData = (req) => {
  const allowedEditFields = ['firstName', 'lastName', 'age', 'gender', 'skills']
  
  const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field))

  console.log('isEditAllowed',isEditAllowed);
 
  return isEditAllowed;
}

module.exports = {
  validateSignUpData,
  validateProfileData
};

