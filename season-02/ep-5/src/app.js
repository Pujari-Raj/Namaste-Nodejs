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

/**
 * In Express.js, you can use regular expressions (regex) in route paths to match flexible patterns instead of
 * exact URLs. This is useful when you want to match multiple similar routes with one rule.
 */

// app.get(/abc/, (req, resp) => {
//   resp.send("Matched regex /abc")
// })

// regex in route, it is not used mostly in real-world API development
// app.get(/^\/ab?cd$/, (req, resp) => {
//   resp.send("Matched regex /acd or /abcd")
// });

// app.get("/ab+cd", (req, res) => {
//   res.send("Matched /abcd, /abbcd, /abbbcd...");
// });

// Dynamic Routes

app.get("/user/:id", (req, resp) => {
  const userId = req.params.id;
  resp.send(`User Id is: ${userId}`)
})

app.get("/blogs/:slug", (req, resp) => {
  const slug = req.params.slug;
  resp.send(`Blog slug: ${slug}`)
})

app.get("/product/:category/:id", (req, resp) => {
  const {category, id} = req.params;
  resp.send(`category: ${category} , product-id: ${id}`)
})

app.use("/", (req, res) => {
  res.send("Hello from main route");
});



app.listen(8080, () => {
  console.log("Server is successfully listening on port 8080.");
});
