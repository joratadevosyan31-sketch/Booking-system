import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
    workStart: { type: String, required: true }, // default start time
    workEnd: { type: String, required: true },   // default end time
    mainBreakStart: { type: String },            // optional override
    mainBreakEnd: { type: String },              // optional override
    defaultBreakBetweenServices: { type: Number } // optional override
});

export const Employee = mongoose.model("Employee", employeeSchema);
