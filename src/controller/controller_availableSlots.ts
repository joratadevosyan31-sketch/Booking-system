import { Request, Response } from "express";
import { Employee } from "../model/employee.js";
import { Booking } from "../model/booking.js";

// Utility to convert "HH:MM" to minutes
const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
};

// Utility to convert minutes to "HH:MM"
const minutesToTime = (minutes: number): string => {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    return `${h}:${m}`;
};

// Generate available time slots
const generateSlots = (
    startTime: string,
    endTime: string,
    bookedSlots: string[] = [],
    slotDuration: number = 15,
    isToday: boolean = false
): string[] => {
    const slots: string[] = [];
    const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();

    let current = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    while (current + slotDuration <= end) {
        const timeStr = minutesToTime(current);

        // Skip booked slots
        if (bookedSlots.includes(timeStr)) {
            current += slotDuration;
            continue;
        }

        // Skip past times if today
        if (isToday && current <= nowMinutes) {
            current += slotDuration;
            continue;
        }

        slots.push(timeStr);
        current += slotDuration;
    }

    return slots;
};


export const getAvailableSlots = async (req: Request, res: Response) => {
    try {
        const employeeId = req.query.employeeId as string;

        if (!employeeId) {
            return res.status(400).json({ message: "employeeId is required" });
        }

        const employee = await Employee.findById(employeeId).exec();
        if (!employee) {
            return res.status(404).json({ message: "Employee not found" });
        }


        const today = new Date();
        const dates: string[] = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(today.getDate() + i);
            dates.push(d.toISOString().split("T")[0]);
        }

        const slotsByDay: Record<string, string[]> = {};
        const availableDays: string[] = [];


        for (const date of dates) {
            const bookings = await Booking.find({
                employee: employeeId,
                date
            })
                .select("time")
                .exec();

            // Normalize booked times to string "HH:MM" for generateSlots
            const bookedTimes = bookings.map((b) => {
                const t = (b as any).time;
                if (t instanceof Date) {
                    return minutesToTime(t.getHours() * 60 + t.getMinutes());
                }
                return String(t);
            });

            const isToday = date === today.toISOString().split("T")[0];
            const slots = generateSlots(
                employee.workStart,
                employee.workEnd,
                bookedTimes,
                15,
                isToday
            );

            if (slots.length > 0) {
                slotsByDay[date] = slots;
                availableDays.push(date);
            }
        }

        return res.json({
            employeeId,
            availableDays,
            slotsByDay
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};
