import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subServices: [{ type: mongoose.Schema.Types.ObjectId, ref: "SubService" }]
});

export const Service = mongoose.model("Service", serviceSchema, "services");
