import { Request, Response } from "express";
import { Employee } from "../model/employee.js";
import { Booking } from "../model/booking.js";
import { Service } from "../model/service.js";

const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
};

const minutesToTime = (minutes: number): string => {
    const h = String(Math.floor(minutes / 60)).padStart(2, "0");
    const m = String(minutes % 60).padStart(2, "0");
    return `${h}:${m}`;
};

const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) => {
    return timeToMinutes(aStart) < timeToMinutes(bEnd) &&
        timeToMinutes(aEnd) > timeToMinutes(bStart);
};

const generateSlots = (
    startTime: string,
    endTime: string,
    bookedSlots: string[] = [],
    slotDuration: number = 15,
    isToday: boolean = false
): string[] => {
    const slots: string[] = [];
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    let current = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);

    while (current + slotDuration <= end) {
        const timeStr = minutesToTime(current);
        if (bookedSlots.includes(timeStr)) {
            current += slotDuration;
            continue;
        }
        if (isToday && current <= nowMinutes) {
            current += slotDuration;
            continue;
        }
        slots.push(timeStr);
        current += slotDuration;
    }

    return slots;
};

export class AvailabilityController {

    async getEmployeeSlots(req: Request, res: Response) {
        try {
            const employeeId = req.query.employeeId as string;
            if (!employeeId) return res.status(400).json({ message: "employeeId is required" });

            const employee = await Employee.findById(employeeId).exec();
            if (!employee) return res.status(404).json({ message: "Employee not found" });

            const today = new Date();
            const todayStr = today.toISOString().split("T")[0];

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
                    date,
                    status: "pending"
                }).select("time").exec();

                const bookedTimes = bookings.map((b: any) => {
                    const t = b.time;
                    if (t instanceof Date) {
                        return minutesToTime(t.getHours() * 60 + t.getMinutes());
                    }
                    return t;
                });

                const isToday = date === todayStr;

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
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }
    }

    async getBookingAvailability(req: Request, res: Response) {
        try {
            const {
                date,
                startTime,
                endTime,
                serviceId,
                bookingId
            } = req.query as Record<string, string>;

            if (!date || !startTime || !endTime || !serviceId) {
                return res.status(400).json({
                    message: "date, startTime, endTime, serviceId are required"
                });
            }

            const conflicts = await Booking.find({
                date,
                status: { $ne: "canceled" },
                ...(bookingId && { _id: { $ne: bookingId } })
            }).select("employee startTime endTime subServices");

            const busyEmployeeIds = conflicts
                .filter(b => overlaps(startTime, endTime, b.startTime, b.endTime))
                .map(b => b.employee)
                .filter(Boolean);

            const availableEmployees = await Employee.find({
                _id: { $nin: busyEmployeeIds },
                services: serviceId
            });

            const service = await Service.findById(serviceId).populate('subServices').exec();
            if (!service) return res.status(404).json({ message: "Service not found" });

            const bookingDuration = timeToMinutes(endTime) - timeToMinutes(startTime);

            const subServices = (service.subServices || []) as any[];
            const availableSubServices = subServices.filter(
                (sub: any) => typeof sub.duration === "number" && sub.duration <= bookingDuration
            );

            return res.json({
                availableEmployees,
                availableSubServices
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Server error" });
        }
    }

}
