const express = require("express");
const connectToDB = require("./config/database");

const app = express();

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
