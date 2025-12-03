import { Request, Response, NextFunction } from "express";

export function validateArmenianPhone(req: Request, res: Response, next: NextFunction) {
    const phone = req.body.phone;
    if (!phone) {
        return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const phoneRegex = /^(\+374|0)(10|41|43|44|77|91|93|94|95|96|97|98|99)\d{6}$/;

    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ success: false, message: "Invalid Armenian phone number" });
    }

    next();
}
