/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MongoClient, MongoServerError } from "mongodb";
import ErrorResponse from "../errorObj/errorClass.js";
import { config } from "dotenv";
import { throwError } from "../utilities/utils.js";
import { User } from "../type.js";
config();

const dbName = process.env.DB_NAME;
const collName = process.env.COLL_NAME ?? "";
const verificationCollection =
  process.env.VERIFICATION_CODE_COLLECTION_NAME ?? "";

const client = new MongoClient(process.env.MONGO_CONNECT_STRING ?? "");

async function connectMongo() {
  try {
    await client.connect();
    console.log("MongoDB atlas connected.");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    console.error("MongoDB client connection error");
  }
}

async function closeMongo() {
  await client.close();
  console.log("Mongo atlas closed.");
}

async function createCollection(
  databaseName: string,
  collectionName: string,
  schema: Document
) {
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

async function saveVerificationCode(email: string, code: string) {
  try {
    const result = await client
      .db(dbName)
      .collection(verificationCollection)
      .insertOne({ email: email, code: code });

    console.log(`verification code is saved for user ${email}`, result);
    return;
  } catch (err) {
    console.error("Error in storing varification code:", err);
    throw err;
  }
}

async function getVerificationCode(email: string) {
  // eslint-disable-next-line no-useless-catch
  try {
    const user = await client
      .db(dbName)
      .collection(verificationCollection)
      .findOne({ email: email });

    if (!user) {
      return false;
    }

    console.log("verification code is found in db: ", user);
    return user.code;
  } catch (err) {
    throw err;
  }
}

async function deleteVerificationCode(email: string) {
  try {
    const deteleResult = await client
      .db(dbName)
      .collection(verificationCollection)
      .deleteOne({ email: email });

    console.log(`verification code deleted for ${email}:`, deteleResult);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function saveUser(formData: User) {
  try {
    const result = await client
      .db(dbName)
      .collection(collName)
      .insertOne(formData);

    console.log("user is saved", result);
    return true;
  } catch (err) {
    // dont send other database errors to the client
    console.error("Error in storing new user:", err);
    // send user all ready exist error
    if (err instanceof MongoServerError && err.code === 11000)
      throwError(`${formData.email} already exists`, 500);
  }
}

async function verifyUser(email: string) {
  const filter = { email: email };

  // eslint-disable-next-line no-useless-catch
  try {
    const user = await client
      .db(dbName)
      .collection(collName)
      .findOne(filter, { projection: { _id: 1, googleVerified: 1 } });

    if (!user) {
      console.error(`${email} is invalid.`);
      return false;
    }

    if (user?.googleVerified) {
      return "google verified";
    }

    console.log(`google user id ${email} is found in db`);

    return true;
  } catch (err) {
    throw err;
  }
}

async function findUser(email: string, context = "verify password") {
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
  // eslint-disable-next-line no-useless-catch
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

async function updateUserPassword(
  email: string,
  pass: string,
  verify: boolean
) {
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
async function saveCsrf(collection: string, hash: string, jwt: string) {
  try {
    const csrfInstance = client.db(dbName).collection(collection);
    //@ts-ignore
    const result = await csrfInstance.insertOne({ _id: hash, jwt: jwt });
    console.log("csrf hash is saved", result);
  } catch (err) {
    console.error(err);
    //@ts-expect-error
    if (err.code === 11000) throw new ErrorResponse("hash already exists", 500);
    throw err;
  }
}

async function findCsrfHash(collection: string, hash: string) {
  // eslint-disable-next-line no-useless-catch
  try {
    const csrfToken = await client
      .db(dbName)
      .collection(collection)
      //@ts-ignore
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

async function deleteCsrfToken(collection: string, token: string) {
  try {
    const deteleResult = await client
      .db(dbName)
      .collection(collection)
      //@ts-ignore
      .deleteOne({ _id: token });

    console.log(`csrf token deleted:`, deteleResult);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function deleteUser(email: string) {
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
  saveVerificationCode,
  getVerificationCode,
  deleteVerificationCode,
};
