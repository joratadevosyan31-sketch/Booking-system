import admin from "../../firebaseAdmin.js";
import { Request, Response, NextFunction } from "express";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split("Bearer ")[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        const decodedToken = await admin.auth().verifyIdToken(token);

        (req as any).user = decodedToken;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: "Unauthorized", error: (err as any)?.message });
    }
};
