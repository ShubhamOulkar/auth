import { MongoClient } from "mongodb";
import ErrorResponse from "../errorObj/errorClass.js";
import { config } from "dotenv";
config();

const dbName = process.env.DB_NAME;
const collName = process.env.COLL_NAME;

const client = new MongoClient(process.env.MONGO_CONNECT_STRING);

async function connectMongo() {
  try {
    await client.connect();
    console.log("Mongo atlas connected.");
  } catch (err) {
    console.error("client connection error");
  }
}

async function closeMongo() {
  await client.close();
  console.log("Mongo atlas closed.");
}

async function createCollection(databaseName, collectionName, schema) {
  try {
    await connectMongo();
    client.db(databaseName).createCollection(collectionName, {
      validator: schema,
      validationAction: "error",
      validationLevel: "strict",
      collation: { locale: "en_US", strength: 2 }, //case insentive
    });
    console.log("collection is created");
  } catch (err) {
    console.error("Error in creating collection:", err);
  }
}

async function saveUser(username, password) {
  try {
    const result = await client
      .db(dbName)
      .collection(collName)
      .insertOne({ user: username, pass: password });

    console.log("user is saved", result);
  } catch (err) {
    console.error("Error in storing new user:", err.errmsg);

    if (err.code === 11000) throw new ErrorResponse("user already exists", 500);
  }
}

async function findUser(username) {
  try {
    const user = await client
      .db(dbName)
      .collection(collName)
      .findOne({ user: username }, { projection: { _id: 0 } });

    if (!user) {
      throw new ErrorResponse("user doesnot exist", 404);
    }

    console.log(`${username} is found in db`);

    return user;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// following function will be replaced with redis db opeartions
async function saveCsrf(collection, hash, jwt) {
  try {
    const csrfInstance = client.db(dbName).collection(collection);
    const result = await csrfInstance.insertOne({ _id: hash, jwt: jwt });
    console.log("hash is saved", result);
  } catch (err) {
    console.error(err);
    if (err.code === 11000) throw new ErrorResponse("hash already exists", 500);
    throw err;
  }
}

async function findCsrfHash(collection, hash) {
  try {
    const csrfToken = await client
      .db(dbName)
      .collection(collection)
      .findOne({ _id: hash });

    if (!csrfToken) {
      throw new ErrorResponse(
        "invalid csrf token : csrf token not found in db",
        500
      );
    }

    console.log("csrf token found in db", hash);
    return csrfToken;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export {
  connectMongo,
  closeMongo,
  createCollection,
  saveUser,
  findUser,
  saveCsrf,
  findCsrfHash,
};
