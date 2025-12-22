import jwt from "jsonwebtoken";
export const authenticate = async (req, res, next) => {
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
};
