const db = require("./dbUtils.js");
require("dotenv").config();

const dbName = process.env.DB_NAME;
const collName = process.env.COLL_NAME;

const dbSchema = {
  $jsonSchema: {
    bsonType: "object",
    title: "usercollection",
    required: ["user", "pass"],
    properties: {
      user: {
        bsonType: "string",
        minLength: 3,
      },
      pass: {
        bsonType: "string",
        minLength: 8,
      },
    },
  },
};

db.createCollection(dbName, collName, dbSchema);
