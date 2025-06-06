# request params, query
# regex in route , use of ?, + , (), *

# 📚 Express.js Notes

## 🔹 What is `app.use()` in Express?

`app.use()` is a middleware function in Express.  
Middleware is a function that has access to:

- The request object (`req`)
- The response object (`res`)
- The next middleware function in the application’s request-response cycle

### 🧩 Characteristics of `app.use()`
- Path matching is **prefix-based**.
- If we provide a path like `/` or `/api`, it matches **any route** that starts with that path.
- Example: The following will match `/`, `/test`, `/user`, etc.

---

## 📨 What is the `request (req)` object?

The `req` object contains all the information sent by the client to the server.

- Holds all data sent from client to server
- Tells the server what kind of action the user is requesting (GET, POST, PUT, DELETE)
- Provides headers that give extra context:

### 📄 Common Headers:
- `Content-Type`: Tells the server what kind of data is being sent (e.g., JSON)
- `Authorization`: Used for permission and authentication

### 🗃 Body Data (for POST/PUT):
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

Happy Learning 🚀
