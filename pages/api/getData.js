// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { MongoClient } from "mongodb";
// import { url_mongo } from "../../variables";

export default async function handler(req, res) {
  // get variable from .env.local file
  const url_mongo = process.env.NEXT_PUBLIC_MONGODB_URI;
  console.log(url_mongo);

  const { username, privateKey } = req.body;
  const client = await MongoClient.connect(url_mongo);
  const db = client.db();
  const dataCollection = db.collection("users");
  // const data = await dataCollection.find().toArray();
  const data = await dataCollection.findOne({
    name: username,
    key: privateKey,
  });
  if (!data) {
    const data = await dataCollection.findOne({
      name: username,
    });
    // client.close();
    console.log(data);
    if (!data) {
      const data2 = await dataCollection.insertOne({
        name: username,
        key: privateKey,
        data: [
          {
            id: "1",
            title: "First note",
            description: "This is the first note",
            date:
              new Date().toLocaleTimeString() + " " + new Date().toDateString(),
          },
        ],
      });
      client.close();
      console.log(data2);
      const sentData = {
        name: username,
        key: privateKey,
        data: [
          {
            id: "1",
            title: "First note",
            description: "This is the first note",
            date:
              new Date().toLocaleTimeString() + " " + new Date().toDateString(),
          },
        ],
      };
      res.status(200).json(sentData);
    } else {
      res.status(404).json({ message: "Wrong key" });
    }
    return;
  }
  const filterData = {
    name: data.name,
    key: data.key,
    data: data.data,
  };

  res.status(200).json(filterData);
}
