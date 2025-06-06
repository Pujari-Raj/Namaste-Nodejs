const express = require("express");

/**
 * express is a framework for node.js , it helps us build web applications and API by providing the structure 
 * and tools to build apps and API 
 * 
 * Think of it like this:
 * 🔧 Node.js gives you the engine (JavaScript runtime).
 * 🏗 Express.js gives you the structure and tools to build apps and APIs on top of that engine.
 */

// to use express in our app we just have to isntall and use it by importing it in our app.
const app = express();

// console.log("express-app", express);

/**
 * app.use is a middleware function in express. middleware is a function that has access to the request object(req)
 * , response object (res) and the next middleware function in app's request-response cycle.
 * 
 * Characteristics of app.use()
 * It is a Path Matching is prefx-based
 * - If we provide a path (like / or /api), it matches any route that starts with that path.
 * - in below examples it will match "/", "/test", "/user" routes
 */

/**
 * what is request (req) , response (res) object
 * 1. req object
 * - The req object contains all the information sent by the client to the server.
 * - It Holds all the data sent from client to server
 * - This tells the server what kind of action the user is requesting (GET, POST, PUT, DELETE)
 * - It provides additional information that provide context, like side notes or instructions. 
 * Some common headers include:-
 * --> Content-Type: Telling the server what kind of data is being sent (e.g., text, JSON).
 * --> Authorization: Checking if the "user has permission" to access certain resources.
 * - For actions like POST and PUT, the user might send additional data (e.g., form submission details).
 * 
 * 
 * 2. response object
 * - The res object is what you use to send a response back to the client.
 * - We should send A three-digit number indicating the request's outcome (eg:- 200, 404)
 * - Depending on the request and response, the body might contain:
 * --> Requested data (e.g., fetched information).
 * --> An error message.
 * --> A redirect instruction telling the browser to go to a different location.
 */

/**
 * ✅ The order of routes matters because Express matches and handles routes in the order they are defined.
 * 
 * 1. Express processes routes from top to bottom
 * When a request comes to your server (like GET /user), Express starts checking the routes you’ve defined from
 * the top of the file to the bottom.
 * As soon as it finds a matching route, and that route sends a response (res.send, res.json, res.end, etc.), it stops and doesn’t look at any further routes.
 * 2. Why this matters?
 * Because if a more generic route like / is placed before more specific routes like /user or /test, it will
 * match everything, and Express won’t even reach the specific ones.
 */

const user = {
  firstName: 'dhamu',
  lastName: 'shamu'
}

app.get("/user", (req, res) => {
  res.send({ message: "user-data", data: user });
});

app.post("/postUse", (req, resp) => {
  resp.send('Data saved to DB');
})


app.use("/", (req, res) => {
  res.send("Hello from main route");
});



app.listen(8080, () => {
  console.log("Server is successfully listening on port 8080.");
});

/**
 * If we use our express app using plain node then we have to restart our server even there is a change of one 
 * single word, so with this working of express app with plain node becomes very tedious so nodemon comes to
 * our rescue and makes our life easier.
 * 
 * What is a nodemon
 * nodemon is a development tool that automatically restarts your server whenever you make changes to your code.
 * It’s like a smart helper that watches your files and saves you from manually stopping and restarting the
 * server.
 */