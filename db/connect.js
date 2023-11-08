const { MongoClient } = require("mongodb");
require("dotenv").config();

const uri = process.env.ATLAS_URI;

const client = new MongoClient(uri);

let _db;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err) {
        console.error("Failed to connect to the database. Error:", err);
        return callback(err);
      }
      _db = client.db(); // Set the database
      console.log("Successfully connected to MongoDB.");
      return callback();
    });
  },

  getDb: function () {
    return _db;
  },
};
