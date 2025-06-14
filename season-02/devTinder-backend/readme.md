
# 📺 Season02 Episode 06: Database, Schema, Models

## 🧩 What is MongoDB Atlas?

MongoDB Atlas is a **cloud-based database service** provided by MongoDB Inc. It allows developers to deploy, manage, and scale MongoDB databases easily across cloud platforms like AWS, Azure, and GCP.

Key Features:
- Fully managed and automated scaling
- Built-in backups and monitoring
- High availability and security
- Easy-to-use web UI

---

## 🧱 What is a Cluster in MongoDB Atlas?

A **cluster** in MongoDB Atlas is a **collection of servers** (called nodes) that host your MongoDB databases. Clusters help ensure high availability, fault tolerance, and scalability.

### Types of Clusters:
- **Shared Cluster (M0-M5):** Good for learning or small apps, free or low cost
- **Dedicated Cluster:** Runs on dedicated resources, suitable for production
- **Multi-Region Cluster:** Data is distributed across multiple regions for global access and disaster recovery

### Components of a Cluster:
- **Primary Node:** Handles all write operations
- **Secondary Nodes:** Maintain copies of data for backup and failover

---

## 📜 What is a Schema in MongoDB?

A **schema** defines the structure and data types of the documents stored in a MongoDB collection, especially when using **Mongoose** (an ODM for MongoDB in Node.js).

Even though MongoDB is schema-less, defining a schema using Mongoose helps in:
- Data validation
- Document structure enforcement
- Cleaner code and maintainability

### 🧪 Example Schema
```js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, default: 18 }
});
```

---

## 🛠️ What is a Model in MongoDB (Mongoose)?

A **model** is a wrapper around the schema. It gives us **methods to interact** with the database.

### Why Use a Model?
- To insert, query, update, delete documents
- It connects schema to a real MongoDB collection

### 🧪 Example Model
```js
const User = mongoose.model("User", userSchema);
```

You can now do:
```js
User.find()               // Fetch all users
User.create({...})        // Create new user
User.updateOne({...})     // Update user
User.deleteOne({...})     // Delete user
```

### 📌 Naming Convention:
If model name is `User`, MongoDB will use the `users` collection by default.