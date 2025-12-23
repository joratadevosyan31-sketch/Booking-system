import express from "express";
import controller_salon from "../controller/controller_salon.js";
import { authenticateAdmin } from "../middleware/adminAuth_middleware.js";

const salon = express.Router();

salon.get("/", controller_salon.getSalon);

salon.patch("/", authenticateAdmin, controller_salon.updateSalon);

export default salon;
