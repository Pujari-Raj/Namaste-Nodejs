const adminAuth = (req, res, next) => {
  console.log("admin auth check");
  const token = "xyz";
  const isAdminAuthorized = token === "xyz";
  console.log("Doing Authorization");
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("user auth check");
  const token = "user";
  const isAdminAuthorized = token === "user";
  console.log("Doing Authorization");
  if (!isAdminAuthorized) {
    res.status(401).send("Unauthorized request");
  } else {
    next();
  }
};

module.exports = {
    adminAuth,
    userAuth
};