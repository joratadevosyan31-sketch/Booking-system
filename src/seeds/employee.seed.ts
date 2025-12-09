import mongoose from "mongoose";
import dotenv from "dotenv";
import { Employee } from "../model/employee.js";
import { Service } from "../model/service.js";
import { SubService } from "../model/subService.js";

dotenv.config();

async function seedEmployees() {
    try {
        await mongoose.connect("mongodb://localhost:27017/bookingService");
        console.log("Database connected");

        await Employee.deleteMany({});
        console.log("Old employees cleared");

        const services = await Service.find().populate("subServices");
        if (!services.length) {
            console.log("No services found! Seed services first.");
            return;
        }

        const subServices = await SubService.find();
        if (!subServices.length) {
            console.log("No subservices found! Seed subservices first.");
            return;
        }

        const employees = [
            { name: "Alice Johnson", profession: "Senior Stylist", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
            { name: "Bob Smith", profession: "Master Barber", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
            { name: "Clara Brown", profession: "Color Specialist", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop" },
            { name: "David Lee", profession: "Hair Stylist", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
            { name: "Eva Green", profession: "Beauty Therapist", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" },
            { name: "Frank White", profession: "Barber", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
            { name: "Grace Kim", profession: "Hair Colorist", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop" },
            { name: "Henry Clark", profession: "Senior Barber", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
            { name: "Isabella Scott", profession: "Stylist", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop" },
            { name: "Jack Lewis", profession: "Master Stylist", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
            { name: "Karen Hall", profession: "Hair Specialist", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop" },
            { name: "Liam Young", profession: "Barber", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop" },
            { name: "Mia Adams", profession: "Color Expert", img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop" },
            { name: "Noah Baker", profession: "Stylist", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
            { name: "Olivia Turner", profession: "Beauty Consultant", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop" },
            { name: "Paul Collins", profession: "Senior Barber", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
            { name: "Quinn Rogers", profession: "Hair Stylist", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" },
            { name: "Ruby Hughes", profession: "Master Colorist", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" },
            { name: "Samuel King", profession: "Barber", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop" },
            { name: "Tina Morgan", profession: "Stylist", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" },
            { name: "Ulysses Reed", profession: "Master Barber", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop" },
            { name: "Victoria Price", profession: "Hair Specialist", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop" },
            { name: "William Ward", profession: "Senior Stylist", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop" },
            { name: "Zoe Brooks", profession: "Color Specialist", img: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop" }
        ];

        function getRandomServices(): mongoose.Types.ObjectId[] {
            const shuffled = services.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, Math.floor(Math.random() * 3) + 1).map((s: any) => s._id);
        }

        function getRandomSubServices(selectedServices: mongoose.Types.ObjectId[]): mongoose.Types.ObjectId[] {
            // Get subservices that belong to the selected services
            const availableSubServices = subServices.filter((sub: any) => 
                selectedServices.some(serviceId => 
                    services.find((s: any) => s._id.equals(serviceId))?.subServices?.some(
                        (subId: mongoose.Types.ObjectId) => subId.equals(sub._id)
                    )
                )
            );
            
            if (availableSubServices.length === 0) return [];
            
            const shuffled = availableSubServices.sort(() => 0.5 - Math.random());
            const count = Math.floor(Math.random() * Math.min(3, shuffled.length)) + 1;
            return shuffled.slice(0, count).map((s: any) => s._id);
        }

        const employeesData = employees.map(emp => {
            const selectedServices = getRandomServices();
            return {
                name: emp.name,
                profession: emp.profession,
                img: emp.img,
                services: selectedServices,
                subServices: getRandomSubServices(selectedServices),
                workStart: "09:00",
                workEnd: "18:00",
                mainBreakStart: "13:00",
                mainBreakEnd: "14:00",
                defaultBreakBetweenServices: 5
            };
        });

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
