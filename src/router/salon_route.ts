import express from "express";
import controller_salon from "../controller/controller_salon.js";

const salon = express.Router();

salon.get("/", controller_salon.getSalon);

salon.patch("/", controller_salon.updateSalon);

export default salon;
