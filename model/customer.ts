import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    phone: { 
        type: String, 
        required: true,
        unique: true,
        trim: true
    },
    name: { 
        type: String,
        trim: true
    },
    verified: { 
        type: Boolean, 
        default: false 
    },
    otp: { 
        type: String 
    },
    otpExpires: { 
        type: Date 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export const Customer = mongoose.model("Customer", customerSchema);
