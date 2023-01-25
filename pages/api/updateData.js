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
  let object_id = newData.id;
  const data = await dataCollection.updateOne(
    { name: username, key: privateKey, "data.id": object_id },
    { $set: { "data.$": newData } }
  );

  client.close();
  console.log(data);
  if (!data) {
    res.status(404).json({ message: "No data found" });
    return;
  }

  res.status(200).json({ message: "Data updated" });
}
