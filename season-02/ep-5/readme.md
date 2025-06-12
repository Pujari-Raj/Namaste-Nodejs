
# 📺 Season02 Episode 04: Routing & Request Handlers

## 📚 Express.js Notes

---

## 🔹 What is `app.use()` in Express?

`app.use()` is a middleware function in Express.  
Middleware is a function that has access to:

- The request object (`req`)
- The response object (`res`)
- The next middleware function in the application’s request-response cycle

### 🧩 Characteristics of `app.use()`
- Path matching is **prefix-based**
- If we provide a path like `/` or `/api`, it matches **any route** that starts with that path
- ✅ Example: The following will match `/`, `/test`, `/user`, etc.

---

## 📨 What is the `request (req)` object?

The `req` object contains all the information sent by the client to the server.

### 📌 Key Features:
- Holds all data sent from client to server
- Tells the server what kind of action the user is requesting (GET, POST, PUT, DELETE)
- Provides headers that give extra context

### 📄 Common Headers:
- `Content-Type`: Tells the server what kind of data is being sent (e.g., JSON)
- `Authorization`: Used for permission and authentication

### 🗃 Body Data (for POST/PUT requests):
- The client might send form or JSON data along with the request

---

## 📤 What is the `response (res)` object?

The `res` object is used to send a response back to the client.

### 🔹 You can:
- Send a status code like `200`, `404`, etc.
- Send data (JSON, HTML, text)
- Send an error message
- Redirect to a different page

---

## 🚦 Why Route Order Matters in Express

### 🔺 Express processes routes **top to bottom**:
When a request comes to the server (e.g., `GET /user`), Express:

1. Starts checking the routes **from top to bottom**
2. As soon as it finds a match and **sends a response** (`res.send`, `res.json`, etc.), it **stops**
3. Any routes after that will **not be executed**

### ⚠️ Important:
If a **generic route** like `/` is placed before more specific routes like `/user` or `/test`, it will match everything before Express even sees the specific ones.

✅ **Best Practice:**  
Place **specific routes first**, and **generic fallback routes (like `/`) last**.

---

## 🔁 Using `nodemon` in Express Development

### 🤔 Why we need nodemon?
If we run our Express app using **plain Node.js**, we need to **manually restart the server** every time we make even a small code change.  
This makes development **slow and frustrating**.

### 🚀 What is `nodemon`?
`nodemon` is a development tool that:

- Watches your files for changes
- Automatically restarts your server when changes are made
- Saves you from having to manually stop and restart the server

### 💡 Example:
Instead of running:

```bash
node app.js
```

Run this instead:

```bash
npx nodemon app.js
```

---

## 📘 What is Dynamic Routing?

**Dynamic routing** in Express.js means creating routes that can accept **variable values** as part of the URL.  
Instead of hardcoding specific paths, dynamic routes allow **placeholders** (called **route parameters**) that can change depending on the request.

### 🧠 Why is it Used?

Dynamic routing is used to:

- Handle multiple similar requests using a **single route handler**
- Fetch data based on parameters like `user ID`, `product ID`, `category`, `slug`, etc.
- Keep your code **clean, reusable, and scalable**

### ✅ Example:

```js
app.get("/user/:id", (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});
```

### 📌 Real-World Examples:
- `/user/123` → get profile for user 123
- `/product/shoes/987` → show product with ID 987 in "shoes" category
- `/blog/how-to-use-nodejs` → load a blog post using slug

---

# 📺 Season02 Episode 05: Middlewares & Error Handlers

In this episode, we explore how **Express.js middlewares** work, how you can use **multiple (n) middlewares**, and a common issue: `Error [ERR_HTTP_HEADERS_SENT]`. We'll also look at how to write proper error-handling middlewares.

---

## 🧩 What Are Middlewares?

In Express.js, a middleware is a function that has access to:

- `req` (the request object)
- `res` (the response object)
- `next()` (function to pass control to the next middleware)

```js
function middleware(req, res, next) {
  // Do something
  next(); // Pass to the next middleware
}
```

Middlewares are used for:
- Logging
- Validations
- Authentication
- Response formatting
- Error handling
- Routing

---

## 🔁 Using n Number of Middlewares

You can use multiple middlewares (n middlewares) for a route by chaining them:

```js
app.use("/user", 
  (req, res, next) => {
    console.log('handling user-1');
    next();
  },
  (req, res, next) => {
    console.log('handling user-2');
    next();
  },
  (req, res) => {
    console.log('final handler');
    res.send("Response from /user");
  }
);
```

Each middleware is executed **in order**. If any middleware does not call `next()` or send a response, the request will hang.

---

## 🕳 What Happens If No Middleware Sends a Response?

If **none** of the middlewares call `res.send()` (or any other method that ends the response), and the last middleware also doesn’t call `next()`, the request **hangs forever**.

Example:
```js
app.use("/user",
  (req, res, next) => {
    console.log("Middleware 1");
    next();
  },
  (req, res, next) => {
    console.log("Middleware 2");
    // Forgot to call res.send() or next()
  }
);
```

Here, the browser waits infinitely — no response is sent, and Express doesn't know what to do next.

---

## ❌ Error: `Error [ERR_HTTP_HEADERS_SENT]`

### 🔍 What does it mean?

This error occurs when **you try to send more than one response** for the same request.

### 💥 Example:
```js
app.use("/user",
  (req, res, next) => {
    res.send("First response");
    next(); // ❌ Calling next after sending a response
  },
  (req, res) => {
    res.send("Second response"); // ❌ Triggers Error
  }
);
```

### ❗ Output:
```
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
```

---

## ✅ How to Avoid It

- ❗ **Do NOT call `next()` after `res.send()`**
- ✅ Only one middleware should send the final response
- ✅ Make sure the last middleware either sends a response or calls `next()` to continue to an error handler

### ✔️ Correct Example:
```js
app.use("/user",
  (req, res, next) => {
    console.log("Middleware 1");
    next();
  },
  (req, res) => {
    console.log("Middleware 2");
    res.send("Final response");
  }
);
```

---

## 🛠 Error Handling Middleware

Express has a special type of middleware for error handling — it takes **four arguments**:

```js
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Something went wrong!");
});
```

To invoke it manually from any middleware:
```js
next(new Error("Custom error message"));
```

---

## 🧵 Summary

- Middlewares run in the order they’re defined.
- You can use multiple (n) middlewares.
- Only one response should be sent per request.
- Avoid calling `next()` after `res.send()`.
- Always handle errors using dedicated error-handling middleware.
