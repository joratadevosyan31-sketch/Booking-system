import mongoose from "mongoose";
import dotenv from "dotenv";
import { Customer } from "../model/customer.js";

dotenv.config();

async function seedCustomers() {
  try {
    await mongoose.connect("mongodb://localhost:27017/bookingService");
    console.log("Database connected");

    // Check if admin already exists
    const existingAdmin = await Customer.findOne({ phone: "+374 93949597" });
    if (existingAdmin) {
      console.log("Admin customer already exists, updating role...");
      existingAdmin.role = "admin";
      existingAdmin.verified = false;
      await existingAdmin.save();
      console.log("Admin customer updated successfully");
    } else {
      // Create admin customer
      await Customer.create({
        phone: "+37493949597",
        name: "Admin",
        role: "admin",
        verified: false,
        otpExpires: new Date(Date.now() + 5 * 60 * 1000)
      });
      console.log("Admin customer seeded successfully");
    }

    await mongoose.disconnect();
    console.log("Database disconnected");
  } catch (error) {
    console.error("Error seeding customers:", error);
    process.exit(1);
  }
}

seedCustomers();
