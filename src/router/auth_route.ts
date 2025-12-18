
import express from "express";
import AuthController from "../controller/controller_auth.js";

const auth = express.Router();

auth.post("/verify-and-login", AuthController.verifyAndLogin);
auth.patch("/invalidate-and-logout", AuthController.inValidateAndLogOut)

export default auth;