import mongoose from "mongoose";
const customerSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true, trim: true },
    name: { type: String, trim: true },
    firebaseUid: { type: String, unique: true },
    role: { type: String, default: "customer", enum: ["customer", "admin"] },
    verified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    lastLogin: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});
export const Customer = mongoose.model("Customer", customerSchema, "customers");
