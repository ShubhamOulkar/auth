import { MongoClient } from "mongodb";
import ErrorResponse from "../errorObj/errorClass.js";
import { config } from "dotenv";
import { throwError } from "../utilities/utils.js";
config();

const dbName = process.env.DB_NAME;
const collName = process.env.COLL_NAME;

const client = new MongoClient(process.env.MONGO_CONNECT_STRING);

async function connectMongo() {
  try {
    await client.connect();
    console.log("MongoDB atlas connected.");
  } catch (err) {
    console.error("MongoDB client connection error");
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

async function saveUser(formData) {
  try {
    const result = await client
      .db(dbName)
      .collection(collName)
      .insertOne(formData);

    console.log("user is saved", result);
    return true;
  } catch (err) {
    // i dont want to send other database errors to the client
    console.error("Error in storing new user:", err.errmsg);

    // only send user allready exist error tot client
    if (err.code === 11000) throwError(`${formData.email} already exists`, 500);
  }
}

async function verifyUser(email, sub = null) {
  const filter = sub
    ? { googleVerified: true, email: email, googleSub: sub }
    : { email: email };

  try {
    const user = await client
      .db(dbName)
      .collection(collName)
      .findOne(filter, { projection: { _id: 1 } });

    if (!user) {
      console.error(`${email} is not ${sub ? "google verified." : "valid."}`);
      return false;
    }

    console.log(`google user id ${email} is found in db`);

    return true;
  } catch (err) {
    throw err;
  }
}

async function findUser(email, context = "verify password") {
  const projection =
    context === "verify password"
      ? { _id: 0, email: 1, password: 1, googleVerified: 1 }
      : {
          _id: 0,
          firstName: 1,
          lastName: 1,
          email: 1,
          googleVerified: 1,
          password: 1,
          picture: 1,
          email_verified: 1,
        };
  try {
    const user = await client.db(dbName).collection(collName).findOne(
      { email: email },
      {
        projection: projection,
      }
    );

    if (!user) {
      throwError(`user ${email} does not exist`, 404);
    }

    console.log(`${email} is found in db`);

    return user;
  } catch (err) {
    throw err;
  }
}

async function updateUserPassword(email, pass, verify) {
  try {
    const result = await client
      .db(dbName)
      .collection(collName)
      .updateOne(
        { email: email },
        { $set: { password: pass, email_verified: verify } }
      );

    if (!result) {
      return false;
    }

    return true;
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
    console.log("csrf hash is saved", result);
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
      throwError("invalid csrf token : csrf token not found in db", 500);
    }

    console.log("csrf token found in db: ", hash);
    return csrfToken;
  } catch (err) {
    throw err;
  }
}

async function deleteCsrfToken(collection, token) {
  try {
    const deteleResult = await client
      .db(dbName)
      .collection(collection)
      .deleteOne({ _id: token });

    console.log(`csrf token deleted:`, deteleResult);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deleteUser(email) {
  try {
    const deteleResult = await client
      .db(dbName)
      .collection(collName)
      .deleteOne({ email: email });

    console.log(`user deleted ${email}`, deteleResult);
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
  deleteUser,
  verifyUser,
  saveCsrf,
  findCsrfHash,
  deleteCsrfToken,
  updateUserPassword,
};
