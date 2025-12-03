import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },

  services: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Service" 
    }
  ],

  workStart: { 
    type: String, 
    required: true 
  }, 

  workEnd: { 
    type: String, 
    required: true 
  },

  mainBreakStart: { 
    type: String, 
    default: null 
  },

  mainBreakEnd: { 
    type: String, 
    default: null 
  },

 
  defaultBreakBetweenServices: { 
    type: Number, 
    default: 5 
  }
});

export const Employee = mongoose.model("Employee", employeeSchema);
