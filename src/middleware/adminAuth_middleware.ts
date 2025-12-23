import jwt from "jsonwebtoken";
import admin from "../../firebaseAdmin.js";
import { Request, Response, NextFunction } from "express";

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {

    console.log("Full Header:", req.headers.authorization);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            success: false,
            message: "Authorization token missing"
        });
        return;
    }

    const token = authHeader.split(" ")[1];

    console.log(authHeader);

    try {
        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (typeof decoded !== "object" || decoded === null) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
        }

        if ((decoded as any).role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied: admin only"
            });
        }

        (req as any).user = decoded;

        next();
    } catch (error) {
        console.error("Admin auth error:", error);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });

    }
}