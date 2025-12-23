import { Request, Response, NextFunction } from "express";
import { Customer } from "../model/customer.js";
import jwt from "jsonwebtoken";
import admin from "../../firebaseAdmin.js";


class AuthController {

    async verifyAndLogin(req: Request, res: Response): Promise<void> {
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
            } else {
                customer.firebaseUid = firebaseUid;
                customer.verified = true;
                customer.lastLogin = new Date();
                await customer.save();
            }

            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET is not defined");
            }

            const token = jwt.sign(
                {
                    userId: customer._id,
                    role: customer.role,
                },
                process.env.JWT_SECRET,
                { expiresIn: "30d" }
            );

            res.status(200).json({
                success: true,
                token,
                user: {
                    id: customer._id,
                    role: customer.role,
                }
            });

        } catch (error: any) {
            res.status(401).json({
                success: false,
                message: error.message
            });
        }
    }


    async inValidateAndLogOut(req: Request, res: Response): Promise<void> {
        try {
            const decoded: any = (req as any).user;

            const customer = await Customer.findById(decoded.userId);
            if (!customer) {
                res.status(404).json({ success: false, message: "User not found" });
                return;
            }

            customer.verified = false;
            delete (customer as any).firebaseUid;

            await customer.save();

            res.status(200).json({ success: true, message: "Logged out successfully" });

        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new AuthController();
