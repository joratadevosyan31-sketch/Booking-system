import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  subServices: [
    { type: mongoose.Schema.Types.ObjectId, ref: "SubService", required: true }
  ],
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, enum: ["pending", "completed", "canceled"], default: "pending" }
});


bookingSchema.index({ customer: 1, date: 1, startTime: 1 }, { unique: true });

export const Booking = mongoose.model("Booking", bookingSchema, "bookings");
