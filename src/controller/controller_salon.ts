import { Request, Response } from "express";
import { SalonAbs } from "../interface/salon_abs.js";
import { Salon } from "../model/salon.js";
import controller_booking from "./controller_booking.js";

class SalonController extends SalonAbs {


    async getSalon(req: Request, res: Response): Promise<void> {
        try {
            const salon = await Salon.findOne();
            res.status(200).json({ success: true, salon });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
    }


    async updateSalon(req: Request, res: Response): Promise<void> {
        try {
            const updateData = req.body;

            const salon = await Salon.findOneAndUpdate(
                {},
                updateData,
                { new: true }
            );

            res.status(200).json({ success: true, salon });
        } catch (err: any) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
}

export default new SalonController();