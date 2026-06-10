const { MongoClient } = require("mongodb");

const client = new MongoClient(process.env.DBURL);

let db;

async function connectDB() {
  await client.connect();
  db = client.db("app-data");
  console.log("🔥 MongoDB connected");
}

function getDB() {
  if (!db) throw new Error("DB not initialized");
  return db;
}

module.exports = { connectDB, getDB };