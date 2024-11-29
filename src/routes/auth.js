import express from "express";
const router = express.Router();
import bcrypt from "bcrypt";
import { saveUser, findUser } from "../db/dbUtils.js";
import verifySession from "../middleware/verifySession.js";
import { throwError } from "../utilities/utils.js";
import getAuthenticationKay from "../utilities/getAuthenticationKey.js";

//verify cross site forgery request and session id
router.use(verifySession);

// user login
router.post("/login", async (req, res, next) => {
  try {
    //TODO validate form data

    const { email, password } = res.locals.formData;

    !email || (!password && throwError("Requested body is invalid", 500));

    const data = await findUser(email);

    // check password
    const passMatch = await bcrypt.compare(password, data.password);

    !passMatch && throwError("Authentication failed, password is wrong.");

    const key = getAuthenticationKay(data.email);

    //TODO save key in cache for 1hr

    // set auth key for 1hr
    res.cookie("key", key, {
      maxAge: 3600000,
      secure: true,
      sameSite: "strict",
    });

    // send response to the client
    res.setHeader("Content-Type", "application/json");

    res.status(200).json({
      success: true,
      msg: `User ${data.email} login successfully.`,
      redirect: "/profile",
    });

    console.log(`${email} login successful`);
  } catch (err) {
    next(err);
  }
});

// user registration
router.post("/register", async (req, res, next) => {
  try {
    const formData = res.locals.formData;

    //throw error on invalid form data
    !formData.username ||
      (!formData.password && throwError("Requested body is invalid", 500));

    // validate form data

    //hash password
    formData.password = await bcrypt.hash(formData.password, 10);
    // add default field email_verified is false
    formData.email_verified = false;

    // add googleSub none
    formData.googleSub = `${formData.email} is not verified by google`;

    // save user into database
    const result = await saveUser(formData);

    // send response to the client
    res.setHeader("Content-Type", "application/json");
    result &&
      res.status(201).json({
        success: true,
        msg: `User ${formData.email} registred successfully. Please login using credentials`,
        redirect: "/login",
      });

    console.log(`${formData.email} registerd successfully.`);
  } catch (err) {
    next(err);
  }
});

export default router;
