import { MongoClient } from "mongodb";
// import { url_mongo } from "../../variables";

// handle post request
export default async function handler(req, res) {
  const url_mongo = process.env.NEXT_PUBLIC_MONGODB_URI;

  const { username, privateKey, newData } = req.body;
  console.log("username", username);
  console.log("privateKey", privateKey);
  console.log("newData", newData);
  const client = await MongoClient.connect(url_mongo);
  const db = client.db();
  const dataCollection = db.collection("users");
  // insert data in array of objects
  const result = await dataCollection.updateOne(
    { name: username, key: privateKey },
    { $push: { data: newData } },
    { upsert: true }
  );

  console.log(result);
  client.close();
  res.status(201).json({ message: "Data stored!" });
}
