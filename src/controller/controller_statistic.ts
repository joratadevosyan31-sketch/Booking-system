import { Request, Response, NextFunction } from "express";
import { Customer } from "../model/customer.js";
import jwt from "jsonwebtoken";
import admin from "../../firebaseAdmin.js";
import { Booking } from "../model/booking.js";


class StatisticController {

    async getBookingStateByday(req: Request, res: Response): Promise<void> {
        try {
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 6);


            const stats = await Booking.aggregate([
                {
                    $match: {
                        createdAt: { $gte: sevenDaysAgo, $lte: today },
                    },
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]);


            const statistic: { date: string; count: number }[] = [];
            for (let i = 0; i < 7; i++) {
                const date = new Date(sevenDaysAgo);
                date.setDate(sevenDaysAgo.getDate() + i);
                const dateString = date.toISOString().split("T")[0];

                const dayData = stats.find((s) => s._id === dateString);
                statistic.push({ date: dateString, count: dayData ? dayData.count : 0 });
            }

            res.status(200).json({ success: true, statistic });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Server Error" });
        }


    }
}


export default new StatisticController()


