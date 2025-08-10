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
      // throw new Error("Invalid Token");
      return res.status(201).json({
        success: false,
        message: "You must be logged In",
      });
    }

    // verifying which user is loggedIn
    // Case 2: Verify the token
    let decodedUserData;
    try {
      decodedUserData = jwtToken.verify(token, "SOUTH-DEV-TINDER"); // Use process.env.JWT_SECRET in production
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token. Please login again.",
      });
    }

    // Case 3: Token valid but user not found in DB
    const userData = await UserModel.findById(decodedUserData._id);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User no longer exists. Please register again.",
      });
    }

    // if user exists , add userData into req.user
    req.user = userData;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong during authentication",
    });
  }
};

module.exports = {
  userAuth,
};
