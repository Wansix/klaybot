require("dotenv").config();
const { MongoClient } = require("mongodb");

const mongoAtlasUri = process.env.MONGODB_URI;

const klaybotDatabase = "klaybot";
const klaybotCollections = {
  user: "user",
};
// db connect
const client = new MongoClient(mongoAtlasUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  connect: async () => {
    client.connect((err) => {
      if (err) {
        console.log("db connect fail!!");
        return;
      } else {
        console.log("db connect!!");
      }
    });
  },

  getCollectionCount: async (collectionName) => {
    const database = client.db(klaybotDatabase);
    return database.collection(collectionName).countDocuments();
  },

  getCollectionNames: () => {
    return klaybotCollections;
  },

  getData: async (collectionName, query) => {
    const database = client.db(klaybotDatabase);
    const collection = database.collection(collectionName);

    return collection.findOne(query);
  },

  insertDoc: async (collectionName, doc) => {
    const database = client.db(klaybotDatabase);
    const collection = database.collection(collectionName);

    return await collection.insertOne(doc);
  },

  deleteDoc: async (collectionName, doc) => {
    const database = client.db(klaybotDatabase);
    const collection = database.collection(collectionName);

    return await collection.deleteOne(doc);
  },

  findAll: async (collectionName) => {
    const database = client.db(klaybotDatabase);
    const collection = database.collection(collectionName);

    return await collection.find().toArray();
  },
};
