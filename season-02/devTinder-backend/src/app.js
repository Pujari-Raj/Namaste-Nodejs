const express = require("express");

// to use express in our app we just have to isntall and use it by importing it in our app.
const app = express();

// console.log("express-app", express);

const user = {
  firstName: 'dhamu',
  lastName: 'shamu'
}

app.get("/user", (req, res) => {
  res.send({ message: "user-data", data: user });
});

app.post("/postUser", (req, resp) => {
  resp.send('Data saved to DB');
})

// app.get(/abc/, (req, resp) => {
//   resp.send("Matched regex /abc")
// })

// regex in route, it is not used mostly in real-world API development
// app.get(/^\/ab?cd$/, (req, resp) => {
//   resp.send("Matched regex /acd or /abcd")
// });

app.get("/ab+cd", (req, res) => {
  res.send("Matched /abcd, /abbcd, /abbbcd...");
});

app.use("/", (req, res) => {
  res.send("Hello from main route");
});



app.listen(8080, () => {
  console.log("Server is successfully listening on port 8080.");
});
