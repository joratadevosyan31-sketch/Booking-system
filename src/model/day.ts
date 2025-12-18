// import mongoose from "mongoose";

// const dayScheduleSchema = new mongoose.Schema({
//   employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
//   date: { type: Date, required: true },
//   workStart: { type: String, required: true },
//   workEnd: { type: String, required: true },
//   mainBreakStart: { type: String, default: null },
//   mainBreakEnd: { type: String, default: null },
//   defaultBreakBetweenServices: { type: Number, default: null }
// });

// dayScheduleSchema.index({ employee: 1, date: 1 }, { unique: true });

// export const DaySchedule = mongoose.model("DaySchedule", dayScheduleSchema, "dayschedules");
