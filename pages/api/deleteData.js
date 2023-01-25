import { MongoClient } from "mongodb";
import { url_mongo } from "../../variables";

// handle post request
export default async function handler(req, res) {
  const { username, privateKey, newData } = req.body;
  console.log("username", username);
  console.log("privateKey", privateKey);
  console.log("newData", newData);
  const client = await MongoClient.connect(url_mongo);
  const db = client.db();
  const dataCollection = db.collection("users");
  const data = await dataCollection.findOne({
    name: username,
    key: privateKey,
  });
  // console.log(data);
  if (!data) {
    res.status(404).json({ message: "No data found" });
    return;
  }
  const newDataCollection = db.collection("users");
  const newDataCollectionData = await newDataCollection.updateOne(
    { name: username, key: privateKey },
    { $pull: { data: { id: newData } } }
  );
  console.log(newDataCollectionData);
  if (!newDataCollectionData) {
    res.status(404).json({ message: "No data found" });
    return;
  }

  client.close();
  // console.log(data);
  if (!data) {
    res.status(404).json({ message: "No data found" });
    return;
  }

  res.status(200).json({ message: "Data deleted" });
}
