import { MongoClient } from "mongodb";
import { mongoConfig } from "./settings.js";

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
    console.log("MongoDb connected to db");
  }

  return _db;
};

const closeConnection = async () => {
  await _connection.close();
};

process.on("SIGINT", async () => {
  console.log("Shutting down MongoDB connection...");
  await closeConnection();
  process.exit(0);
});

export { dbConnection, closeConnection };
