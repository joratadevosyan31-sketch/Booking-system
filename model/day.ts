import mongoose from "mongoose";

const dayScheduleSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  date: { type: Date, required: true },        // specific day
  workStart: { type: String, required: true }, // overrides employee default
  workEnd: { type: String, required: true },
  mainBreakStart: { type: String },            // optional override
  mainBreakEnd: { type: String },
  defaultBreakBetweenServices: { type: Number } // optional override
});

export const DaySchedule = mongoose.model("DaySchedule", dayScheduleSchema);
