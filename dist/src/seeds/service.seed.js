import mongoose from "mongoose";
import dotenv from "dotenv";
import { Service } from "../model/service.js";
import { SubService } from "../model/subService.js";
dotenv.config();
async function seedServices() {
    try {
        await mongoose.connect("mongodb://localhost:27017/bookingService");
        console.log("Database connected");
        const existingService = await Service.findOne();
        if (existingService) {
            console.log("Services already exist, skipping seeding");
        }
        else {
            const servicesData = [
                {
                    name: "Hand Care",
                    subServices: [
                        { name: "Classic Manicure", duration: 30, price: 5000 },
                        { name: "Gel Manicure", duration: 60, price: 8000 },
                        { name: "French Manicure", duration: 45, price: 7000 },
                        { name: "Nail Repair", duration: 20, price: 3000 },
                        { name: "Nail Polish", duration: 15, price: 2000 },
                        { name: "Spa Hand Treatment", duration: 30, price: 6000 }
                    ]
                },
                {
                    name: "Foot Care",
                    subServices: [
                        { name: "Classic Pedicure", duration: 45, price: 7000 },
                        { name: "Gel Pedicure", duration: 70, price: 12000 },
                        { name: "Spa Pedicure", duration: 60, price: 10000 },
                        { name: "Heel Treatment", duration: 20, price: 4000 },
                        { name: "Nail Cutting", duration: 15, price: 3000 },
                        { name: "Foot Massage", duration: 20, price: 5000 }
                    ]
                },
                {
                    name: "Hair",
                    subServices: [
                        { name: "Women's Haircut", duration: 45, price: 8000 },
                        { name: "Men’s Haircut", duration: 30, price: 5000 },
                        { name: "Kids Haircut", duration: 20, price: 3000 },
                        { name: "Blow Dry", duration: 30, price: 6000 },
                        { name: "Hair Coloring", duration: 120, price: 20000 },
                        { name: "Keratin Treatment", duration: 150, price: 35000 }
                    ]
                },
                {
                    name: "Makeup",
                    subServices: [
                        { name: "Day Makeup", duration: 45, price: 15000 },
                        { name: "Evening Makeup", duration: 60, price: 25000 },
                        { name: "Bridal Makeup", duration: 120, price: 60000 },
                        { name: "Eyebrow Makeup", duration: 20, price: 5000 },
                        { name: "Makeup Trial", duration: 60, price: 20000 }
                    ]
                },
                {
                    name: "Brows & Lashes",
                    subServices: [
                        { name: "Eyebrow Shaping", duration: 15, price: 3000 },
                        { name: "Eyebrow Tinting", duration: 20, price: 4000 },
                        { name: "Lash Lift", duration: 50, price: 15000 },
                        { name: "Lash Tinting", duration: 20, price: 5000 },
                        { name: "Brow Lamination", duration: 45, price: 15000 }
                    ]
                },
                {
                    name: "Cosmetology",
                    subServices: [
                        { name: "Facial Cleaning", duration: 60, price: 25000 },
                        { name: "Hydrafacial", duration: 45, price: 35000 },
                        { name: "Chemical Peel", duration: 40, price: 40000 },
                        { name: "Anti-Aging Treatment", duration: 60, price: 50000 },
                        { name: "Acne Treatment", duration: 30, price: 30000 }
                    ]
                },
                {
                    name: "Waxing",
                    subServices: [
                        { name: "Full Legs", duration: 45, price: 12000 },
                        { name: "Half Legs", duration: 25, price: 7000 },
                        { name: "Arms", duration: 20, price: 6000 },
                        { name: "Underarms", duration: 15, price: 3000 },
                        { name: "Bikini", duration: 20, price: 10000 },
                        { name: "Full Body", duration: 90, price: 30000 }
                    ]
                }
            ];
            for (const service of servicesData) {
                const newService = await Service.create({ name: service.name });
                const createdSubServices = await SubService.insertMany(service.subServices.map(sub => ({ ...sub, service: newService._id })));
                newService.subServices = createdSubServices.map(s => s._id);
                await newService.save();
            }
            console.log("Services and SubServices seeded successfully");
        }
        await mongoose.disconnect();
        console.log("Database disconnected");
    }
    catch (error) {
        console.error("Error seeding services:", error);
        process.exit(1);
    }
}
seedServices();
