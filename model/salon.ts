import mongoose from "mongoose";

const salonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String },
    workStart: { type: String, default: "09:00" }, // salon opening time
    workEnd: { type: String, default: "19:00" },   // salon closing time
    mainBreakStart: { type: String, default: "13:00" }, // default salon break
    mainBreakEnd: { type: String, default: "14:00" },
    defaultBreakBetweenServices: { type: Number, default: 5 }, // minutes
});

export const Salon = mongoose.model("Salon", salonSchema);
