// import mongoose from "mongoose";
// import { Customer } from "../model/customer.js";

// async function seedCustomers() {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/bookingService");
//     console.log("Database connected");

//     const existingCustomer = await Customer.findOne();
//     if (existingCustomer) {
//       console.log("Customers already exist, skipping seeding");
//     } else {
//       await Customer.create([
//         { phone: "091234567", name: "Alice" },
//         { phone: "099876543", name: "Bob" }
//       ]);

//       console.log("Customers seeded successfully");
//     }

//     await mongoose.disconnect();
//     console.log("Database disconnected");
//   } catch (error) {
//     console.error("Error seeding customers:", error);
//     process.exit(1);
//   }
// }

// seedCustomers();
