import mongoose from "mongoose";
import dotenv from "dotenv";
import { Salon } from "../model/salon.js";

dotenv.config();

async function seedSalon() {
  try {
    await mongoose.connect("mongodb://localhost:27017/bookingService");
    console.log("Database connected");

    const existingSalon = await Salon.findOne();
    if (existingSalon) {
      console.log("Salon already exists, skipping seeding");
    } else {
      await Salon.create({
        name: "Paragon",
        address: "9 Ghazar Parpetsi St, 8, Yerevan",
        workStart: "09:00",
        workEnd: "19:00",
        mainBreakStart: "13:00",
        mainBreakEnd: "14:00",
        defaultBreakBetweenServices: 5
      });
      console.log("Salon seeded successfully");
    }

    await mongoose.disconnect();
    console.log("Database disconnected");
  } catch (error) {
    console.error("Error seeding salon:", error);
    process.exit(1);
  }
}

seedSalon();
