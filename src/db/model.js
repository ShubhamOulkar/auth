import db from "./dbUtils.js";
import { config } from "dotenv";
config();

const dbName = process.env.DB_NAME;
const collName = process.env.COLL_NAME;

const dbSchema = {
  $jsonSchema: {
    bsonType: "object",
    title: "usercollection",
    required: [
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
      "email_verified",
    ],
    properties: {
      firstName: {
        bsonType: "string",
        minLength: 1,
      },
      lastName: {
        bsonType: "string",
        minLength: 1,
      },
      email: {
        bsonType: "string",
        minLength: 3,
      },
      password: {
        bsonType: "string",
        minLength: 8,
      },
      confirmPassword: {
        bsonType: "string",
      },
      email_verified: {
        bsonType: "bool",
      },
    },
  },
};

db.createCollection(dbName, collName, dbSchema);
