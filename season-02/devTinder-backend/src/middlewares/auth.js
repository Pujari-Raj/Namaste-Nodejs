const jwtToken = require("jsonwebtoken");
const UserModel = require("../models/user");

// const adminAuth = (req, res, next) => {
//   console.log("admin auth check");
//   const token = "xyz";
//   const isAdminAuthorized = token === "xyz";
//   console.log("Doing Authorization");
//   if (!isAdminAuthorized) {
//     res.status(401).send("Unauthorized request");
//   } else {
//     next();
//   }
// };

const userAuth = async (req, res, next) => {
  try {
    // getting token , we use req.cookies but we need cookie-parser package as well
    const { token } = req.cookies;
    // console.log("token", token);

    if (!token) {
      throw new Error("Invalid Token");
    }

    // verifying which user is loggedIn
    const decodedUserData = await jwtToken.verify(token, "SOUTH-DEV-TINDER");
    // console.log("decodedUserData", decodedUserData);

    const { _id } = decodedUserData;
    // console.log("user-Id", _id);

    // getting userdata based on Id we got from token

    const userData = await UserModel.findById(_id);
    // console.log("userData", userData);

    if (!userData) {
      throw new Error("User Does not exist");
    }

    // res.send(userData);
    req.user = userData
    next();
  } catch (err) {
    res.status(400).send("error-" + err.message);
  }
};

module.exports = {
  userAuth,
};
