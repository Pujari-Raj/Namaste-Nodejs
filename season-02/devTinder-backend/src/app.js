const express = require("express");
const connectToDB = require("./config/database");
// const UserModel = require("./models/user");
// for getting token
const cookieParser = require("cookie-parser");
// const jwtToken = require("jsonwebtoken");
const http = require("http");


const app = express();

app.use(express.json());
app.use(cookieParser());


// getting all routers

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require("cors");
const initializeSocket = require("./utils/socket");

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRequestRouter);
app.use("/", userRouter);

// creating server
const server = http.createServer(app);

//
initializeSocket(server)

connectToDB()
  .then(() => {
    console.log("Database connection established");
    server.listen(8080, () => {
      console.log("Server is successfully listening on port 8080.");
    });
  })
  .catch((error) => {
    console.error("Database connection failed", error);
  });
