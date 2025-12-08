import mongoose from "mongoose";
import dotenv from "dotenv";
import { Employee } from "../model/employee.js";
import { Service } from "../model/service.js";

dotenv.config();

async function seedEmployees() {
    try {
        await mongoose.connect("mongodb://localhost:27017/bookingService");
        console.log("Database connected");

        await Employee.deleteMany({});
        console.log("Old employees cleared");

        const services = await Service.find();
        if (!services.length) {
            console.log("No services found! Seed services first.");
            return;
        }

        const names = [
            "Alice Johnson", "Bob Smith", "Clara Brown", "David Lee",
            "Eva Green", "Frank White", "Grace Kim", "Henry Clark",
            "Isabella Scott", "Jack Lewis", "Karen Hall", "Liam Young",
            "Mia Adams", "Noah Baker", "Olivia Turner", "Paul Collins",
            "Quinn Rogers", "Ruby Hughes", "Samuel King", "Tina Morgan",
            "Ulysses Reed", "Victoria Price", "William Ward", "Zoe Brooks"
        ];

        function getRandomServices() {
            const shuffled = services.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.floor(Math.random() * 3) + 1).map(s => s._id);
        }

        const employeesData = names.map(name => ({
            name,
            services: getRandomServices(),
            workStart: "09:00",
            workEnd: "18:00",
            mainBreakStart: "13:00",
            mainBreakEnd: "14:00",
            defaultBreakBetweenServices: 5
        }));

        const createdEmployees = await Employee.insertMany(employeesData);
        console.log(`Employees seeded successfully: ${createdEmployees.length}`);

        await mongoose.disconnect();
        console.log("Database disconnected");
    } catch (error) {
        console.error("Error seeding employees:", error);
        process.exit(1);
    }
}

seedEmployees();
