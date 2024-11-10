import db from "./dbUtils";
import { configDotenv } from "dotenv";
configDotenv();

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
