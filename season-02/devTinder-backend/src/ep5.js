const express = require("express");

const app = express();

const {adminAuth, userAuth} = require("./utils/auth")

/**
 * When we write n number of middlewares only the final/last middleware should send res.send/res.end, res.json
 * if we use resp.send('..') in every middleware it will throw us an
 * error :rror [ERR_HTTP_HEADERS_SENT]:Cannot set headers after they are sent to the client
 * why do we get the abov error:
 * 1. First middleware is executed and calls resp.send('hello user'). This sends the response to the client and
 * ends the request-response cycle.
 * 2. Then it calls next(), so the second middleware runs.
 * 3. The second middleware tries to call resp.send("2nd response") again, but it’s too late — the headers and
 * body were already sent, so Express throws the ERR_HTTP_HEADERS_SENT error.
 */

/**
 * 1. app.use("/route", () => {...})
 * 2. [(req, resp, next) => {
 * console.log('handlding the route user-2!');
 *  // resp.send("2nd response")
 *  next();
 * }
 * etc.
 * this all are the middlewares
 * The function which sends which takes the request and sends back the response is known as the request handler
 * In below example the last function is the request handler
 */

// app.use("/user", (req, resp, next) => {
//     console.log('handlding the route user-1!');
//     // resp.send('hello user');
//     next();
// },
// [(req, resp, next) => {
//     console.log('handlding the route user-2!');
//     // resp.send("2nd response")
//     next();
// },
// (req, resp, next) => {
//     console.log('handlding the route user-3!');
//     // resp.send("3rd response")
//     next();
// }],
// (req, resp, next) => {
//     console.log('handlding the route user-4!');
//     // resp.send("4th response")
//     next();
// },
// (req, resp, next) => {
//     console.log('handlding the route user-5!');
//     resp.send("5th response")
// }
// )

// app.user("/admin") will only authorized the routes which starts from /admin 

// app.use("/admin", (req, res, next) => {
//   const token = "xyz";
//   const isAdminAuthorized = token === "xyz";
//   console.log('Doing Authorization');
//   if (!isAdminAuthorized) {
//     res.status(401).send("Unauthorized request");
//   } else {
//     next();
//   }
// });

app.use("/admin", adminAuth);

app.get("/admin/getAllUsers", (req, res) => {
    res.status(200).send("All User Data");
});

// app.get("/user", (req, res) => {
//     res.status(200).send("All User Data");
// });

// directly using auth from my auth.js file 
app.get("/user", userAuth,(req, res) => {
    res.status(200).send("All User Data");
});

app.listen(8080, () => {
  console.log("Server is successfully listening on port 8080.");
});
