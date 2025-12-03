import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    subService: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubService",
        required: true
    },
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    customerName: { type: String, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true }, // e.g., "10:00"
    endTime: { type: String, required: true },   // calculated based on service + breaks
});

export const Booking = mongoose.model("Booking", bookingSchema);
