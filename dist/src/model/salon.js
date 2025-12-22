import mongoose from "mongoose";
const salonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, default: "" },
    workStart: { type: String, default: "09:00" },
    workEnd: { type: String, default: "19:00" },
    mainBreakStart: { type: String, default: "13:00" },
    mainBreakEnd: { type: String, default: "14:00" },
    defaultBreakBetweenServices: { type: Number, default: 5 }
});
// Ensure only one salon by unique name
salonSchema.index({ name: 1 }, { unique: true });
// Explicit collection name to avoid duplicates
export const Salon = mongoose.model("Salon", salonSchema, "salon");
