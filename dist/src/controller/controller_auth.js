// import { Request, Response } from "express";
// import { Customer } from "../model/customer.js";
// import jwt from "jsonwebtoken";
import { Customer } from "../model/customer.js";
import jwt from "jsonwebtoken";
import admin from "../../firebaseAdmin.js";
class AuthController {
    async verifyAndLogin(req, res) {
        try {
            const { idToken, verificationCode } = req.body;
            console.log(idToken);
            if (!idToken) {
                res.status(400).json({
                    success: false,
                    message: "Firebase ID token required"
                });
                return;
            }
            // 🔐 Verify Firebase token
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const firebaseUid = decodedToken.uid;
            const phone = decodedToken.phone_number;
            if (!phone) {
                res.status(400).json({
                    success: false,
                    message: "Phone number not found in Firebase token"
                });
                return;
            }
            let customer = await Customer.findOne({ phone });
            if (!customer) {
                customer = await Customer.create({
                    phone,
                    name: "",
                    verified: true,
                    lastLogin: new Date(),
                    otp: verificationCode,
                    otpExpires: new Date(Date.now() + 5 * 60 * 1000),
                    firebaseUid,
                });
            }
            else {
                customer.firebaseUid = firebaseUid;
                customer.verified = true;
                customer.lastLogin = new Date();
                await customer.save();
            }
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined");
            }
            const token = jwt.sign({
                userId: customer._id,
                phone: customer.phone,
            }, process.env.JWT_SECRET, { expiresIn: "30d" });
            res.status(200).json({
                success: true,
                token,
                user: {
                    id: customer._id,
                    role: customer.role,
                }
            });
        }
        catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }
    // 🔐 JWT Middleware
    verifyToken(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                success: false,
                message: "Authorization token missing"
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        try {
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined");
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // @ts-ignore (կամ ստեղծիր custom Request type)
            req.user = decoded;
            next();
        }
        catch {
            res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
    }
    async inValidateAndLogOut(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                res.status(401).json({ success: false, message: "Authorization token missing" });
                return;
            }
            const token = authHeader.split(" ")[1];
            if (!token) {
                res.status(400).json({ success: false, message: "Token required" });
                return;
            }
            if (!process.env.JWT_SECRET)
                throw new Error("JWT_SECRET is not defined");
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const customer = await Customer.findById(decoded.userId);
            if (!customer) {
                res.status(404).json({ success: false, message: "User not found" });
                return;
            }
            customer.verified = false;
            delete customer.firebaseUid;
            await customer.save();
            res.status(200).json({ success: true, message: "Logged out successfully" });
        }
        catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}
export default new AuthController();
