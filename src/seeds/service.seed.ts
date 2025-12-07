// import mongoose from "mongoose";
// import { Service } from "../model/service.js";
// import { SubService } from "../model/subService.js";

// async function seedServices() {
//   try {
//     await mongoose.connect("mongodb://localhost:27017/bookingService");
//     console.log("Database connected");

//     const existingService = await Service.findOne();
//     if (existingService) {
//       console.log("Services already exist, skipping seeding");
//     } else {
//       const haircut = await Service.create({ name: "Haircut" });
//       await SubService.create([
//         { name: "Men Haircut", duration: 30, price: 20, service: haircut._id },
//         { name: "Women Haircut", duration: 45, price: 35, service: haircut._id }
//       ]);

//       console.log("Services and subservices seeded successfully");
//     }

//     await mongoose.disconnect();
//     console.log("Database disconnected");
//   } catch (error) {
//     console.error("Error seeding services:", error);
//     process.exit(1);
//   }
// }

// seedServices();
