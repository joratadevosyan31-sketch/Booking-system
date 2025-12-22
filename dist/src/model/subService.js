import mongoose from "mongoose";
const subServiceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }
});
export const SubService = mongoose.model("SubService", subServiceSchema, "subservices");
