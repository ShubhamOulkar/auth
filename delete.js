import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { jwtDecrypt, base64url } from "jose";
config();
import generateSessionId from "./src/utilities/getSessionId.js";
import { verifySessionId } from "./src/routes/googleVerify.js";
const CSRF_SECRET = process.env.CSRF_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;
const sessionSecreteKey = base64url.decode(SESSION_SECRET);

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM4ZTE5Y2RhMjc2MTNhNTRmOTdjZjA4ZDViNWFmZWExNmMwNjNiNWZkNWM2NzRlOTA3OTk4YzdmYWEzYWEyZWQiLCJpYXQiOjE3MzE5OTAyNjUsInNlc3Npb25JZCI6ImV5SmhiR2NpT2lKa2FYSWlMQ0psYm1NaU9pSkJNVEk0UTBKRExVaFRNalUySWl3aWRIbHdJam9pYW5kMEluMC4uUVA5ZHRIdUwxWGs2RjJSeVo3Y2w0Zy5MOGdObGtDekxqX254OFhkTnpBTUVQdjg4ZFVaeEVpMi03Y3VweVlOSk9kZGJsbXFNNUpWMFFCWHowOHNGUmxhbEVkRV9wb3k3c2ZpVDFSaG5NN2FoNnkxVmVvellUNU91YVhMMDBiak1VRUlsNFFjNDhnall6OUhIajhPYVFKTnhLS2Zmcm9CNFliZ2hEWjdvMzlkNERyOG5zcnMxQkJCNDJSMllZZHRGQUNqdUVhVUdvWWRSdElTay01eFBDN3dOWnAzVjNteVdoT21QbFF1SWZwblJMSVd5Z3RWOTREaWJXWjMyeW1ocnNNUkRZdFYwRjNqNDhEQkhIUzJUaVBCb0dfQUNYbllLY1ptNHZnMEJZUFNQUS4wMUJJZmkzbzkxM2NidTBvVWxLWGVnIn0.CwrC37CGuc2fct3zBVVvFapTAVg0YIde5pvd1FU4bGs";

const csrfPayload = jwt.verify(token, CSRF_SECRET);

const session = await generateSessionId();

// let { payload: payload_1, protectedHeader: header_1 } = await jwtDecrypt(
//   session,
//   sessionSecreteKey,
//   {
//     issuer: process.env.JWT_ISSURE,
//     audience: process.env.JWT_AUDIENCE,
//   }
// );

// let { payload: payload_2, protectedHeader: header_2 } = await jwtDecrypt(
//   session,
//   sessionSecreteKey,
//   {
//     issuer: process.env.JWT_ISSURE,
//     audience: process.env.JWT_AUDIENCE,
//   }
// );

// try {
//   const [
//     {
//       payload: { payload: payload_1 },
//       protectedHeader: header_1,
//     },
//     {
//       payload: { payload: payload_2 },
//       protectedHeader: header_2,
//     },
//   ] = await Promise.all([
//     await jwtDecrypt(session, sessionSecreteKey, {
//       issuer: process.env.JWT_ISSURE,
//       audience: process.env.JWT_AUDIENCE,
//       subject: process.env.JWT_SUBJECT,
//     }),
//     await jwtDecrypt(session, sessionSecreteKey, {
//       issuer: process.env.JWT_ISSURE,
//       audience: process.env.JWT_AUDIENCE,
//       subject: process.env.JWT_SUBJECT,
//     }),
//   ]);

//   Object.keys(payload_1).forEach((key) => {
//     payload_1[key] === payload_2[key] &&
//       console.error(`invalid jwt payload : ${key}`);
//   });
// } catch (err) {
//   console.log(err.name);
// }

// verify session id
verifySessionId(session, session)
  .then((res) => console.log("Session id verified successfully : ", res))
  .catch((err) => {
    console.error(err);
  });
