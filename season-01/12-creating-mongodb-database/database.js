// const { MongoClient} = require("mongodb");
import { MongoClient, ObjectId } from "mongodb";

// creating db locally 
const url = "mongodb://127.0.0.1:27017";

const client = new MongoClient(url);
const dbName = "namaste-node";

async function main() {
  await client.connect();
  console.log("Connected to mongodb server");

  const db = client.db(dbName);
  const collection = db.collection("Users");

  const data = {
    firstName: "Rahul",
    lastName: "Lajawab",
    city: "Mumbai",
  };

  // create
  const insertUser = await collection.insertOne(data);
  console.log("new user:", insertUser);

  // read
  // const findUser = await collection.find({}).toArray();
  // console.log("find", findUser);

  // const getUser = await collection.find({ firstName: "Rahul" }).toArray();
  // console.log("getUser", getUser);

  // update
  // const updateData = await collection.updateOne({lastName: "Lajawab"}, {$set: {lastName: "Elegance"}})
  // console.log("updateData", updateData);

  // delete 
  /**
   * for deleting based on id we need to use ObjectId is a constructor function 
   * It creates a new, unique identifier that MongoDB typically uses as the default _id for documents.
   * It's part of the bson module, and it's automatically used when you insert a document without specifying an _id.
   */
  const deleteData = await collection.deleteOne({
    _id: new ObjectId("6810e5eb45c6d0aed88d223f"),
  });
  console.log("deleteData", deleteData);

  // 
  const myId = new ObjectId();
  console.log(myId);
  
  console.log(myId.getTimestamp()); // we can get a timestamp of id when it was created 

  /**
   * what is objectId:
   * - ObjectId is a special 12-byte unique identifier used by MongoDB.
   * - A 4-byte timestamp, representing the ObjectId's creation, measured in seconds since the Unix epoch.
   * - A 5-byte random value generated once per process. This random value is unique to the machine and process.
   * - A 3-byte incrementing counter, initialized to a random value.
   * 
   * It is designed to be:-
   * - Globally unique
   * - Efficient for sorting by creation time
   * - 
   */
}

main()
  .then(console.log())
  .catch(console.error)
  .finally(() => client.close());
