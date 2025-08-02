const express = require("express");
const connectToDB = require("./config/database");
// const UserModel = require("./models/user");
// for getting token
const cookieParser = require("cookie-parser");
// const jwtToken = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cookieParser());

// getting all routers

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/request")

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/", connectionRequestRouter)

connectToDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(8080, () => {
      console.log("Server is successfully listening on port 8080.");
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
  });

//

