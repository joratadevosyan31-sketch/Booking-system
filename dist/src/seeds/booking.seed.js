import mongoose from "mongoose";
import { Booking } from "../model/booking.js";
import { Customer } from "../model/customer.js";
import { Employee } from "../model/employee.js";
import { SubService } from "../model/subService.js";
async function seedBookings() {
    try {
        await mongoose.connect("mongodb://localhost:27017/bookingService");
        console.log("Database connected");
        const existingBooking = await Booking.findOne();
        if (existingBooking) {
            console.log("Bookings already exist, skipping seeding");
        }
        else {
            const customer = await Customer.findOne();
            const employee = await Employee.findOne();
            const subService = await SubService.findOne();
            await Booking.create({
                service: subService?.service || null,
                subService: subService?._id || null,
                employee: employee?._id || null,
                customer: customer?._id || null,
                date: new Date(),
                startTime: "10:00",
                endTime: "10:30",
                status: "pending"
            });
            console.log("Bookings seeded successfully");
        }
        await mongoose.disconnect();
        console.log("Database disconnected");
    }
    catch (error) {
        console.error("Error seeding bookings:", error);
        process.exit(1);
    }
}
seedBookings();
