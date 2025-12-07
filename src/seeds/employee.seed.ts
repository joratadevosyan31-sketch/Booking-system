// import mongoose from "mongoose";
// import { Employee } from "../model/employee.js";
// import { Service } from "../model/service.js";

// async function seedEmployees() {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/bookingService");
//     console.log("Database connected");

//     const existingEmployee = await Employee.findOne();
//     if (existingEmployee) {
//       console.log("Employees already exist, skipping seeding");
//     } else {
//       const services = await Service.find();
//       await Employee.create([
//         { name: "John Doe", services: [services[0]._id], workStart: "09:00", workEnd: "19:00" },
//         { name: "Jane Smith", services: [services[0]._id], workStart: "09:00", workEnd: "19:00" }
//       ]);

//       console.log("Employees seeded successfully");
//     }

//     await mongoose.disconnect();
//     console.log("Database disconnected");
//   } catch (error) {
//     console.error("Error seeding employees:", error);
//     process.exit(1);
//   }
// }

// seedEmployees();
