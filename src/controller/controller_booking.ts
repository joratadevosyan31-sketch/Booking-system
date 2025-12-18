import { Request, Response } from "express";
import { Booking } from "../model/booking.js";
import { Customer } from "../model/customer.js";
import { Service } from "../model/service.js";
import { SubService } from "../model/subService.js";
import { Employee } from "../model/employee.js";
import { BookingAbs } from "../interface/booking_abs.js";


function calculateEndTime(startTime: string, duration: number): string {
    const [hours, minutes] = startTime.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
}


class BookingController extends BookingAbs {

    async getBookings(req: Request, res: Response): Promise<void> {
        try {
            const bookings = await Booking.find()
                .populate("customer")
                .populate("service")
                .populate("subService")
                .populate("employee");
            res.status(200).json({ success: true, bookings });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getBooking(req: Request, res: Response): Promise<void> {
        try {
            const { bookingId } = req.body;
            if (!bookingId) {
                res.status(400).json({ success: false, message: "Booking ID is required" });
                return;
            }

            const booking = await Booking.findById(bookingId)
                .populate("customer")
                .populate("service")
                .populate("subService")
                .populate("employee");

            if (!booking) {
                res.status(404).json({ success: false, message: "Booking not found" });
                return;
            }

            res.status(200).json({ success: true, booking });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async setBooking(req: Request, res: Response): Promise<void> {
        try {
            const { service, subService, employee, customer, date, startTime } = req.body;
            if (!service || !subService || !employee || !customer || !date || !startTime) {
                res.status(400).json({ success: false, message: "Missing required fields" });
                return;
            }

            const subServiceData = await SubService.findById(subService);
            if (!subServiceData) {
                res.status(404).json({ success: false, message: "SubService not found" });
                return;
            }

            const employeeData = await Employee.findById(employee);
            const breakBetween = employeeData?.defaultBreakBetweenServices || 5;
            const totalDuration = subServiceData.duration + breakBetween;
            const endTime = calculateEndTime(startTime, totalDuration);

            const booking = await Booking.create({
                service,
                subService,
                employee,
                customer,
                date,
                startTime,
                endTime,
                status: "pending"
            });

            res.status(201).json({ success: true, booking });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateBooking(req: Request, res: Response): Promise<void> {
        try {
            const { bookingId, service, subService, employee, customer, date, startTime } = req.body;
            if (!bookingId) {
                res.status(400).json({ success: false, message: "Booking ID is required" });
                return;
            }

            const updateData: any = {};
            if (service) updateData.service = service;
            if (subService) updateData.subService = subService;
            if (employee) updateData.employee = employee;
            if (customer) updateData.customer = customer;
            if (date) updateData.date = date;
            if (startTime) {
                updateData.startTime = startTime;
                const subServiceData = subService ? await SubService.findById(subService) : await SubService.findById(updateData.subService);
                const employeeData = employee ? await Employee.findById(employee) : await Employee.findById(updateData.employee);
                const breakBetween = employeeData?.defaultBreakBetweenServices || 5;
                const totalDuration = (subServiceData?.duration || 0) + breakBetween;
                updateData.endTime = calculateEndTime(startTime, totalDuration);
            }

            const updatedBooking = await Booking.findByIdAndUpdate(bookingId, updateData, { new: true })
                .populate("customer")
                .populate("service")
                .populate("subService")
                .populate("employee");

            if (!updatedBooking) {
                res.status(404).json({ success: false, message: "Booking not found" });
                return;
            }

            res.status(200).json({ success: true, booking: updatedBooking });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async deleteBooking(req: Request, res: Response): Promise<void> {
        try {
            const { bookingId } = req.body;
            if (!bookingId) {
                res.status(400).json({ success: false, message: "Booking ID is required" });
                return;
            }

            const deletedBooking = await Booking.findByIdAndDelete(bookingId);
            if (!deletedBooking) {
                res.status(404).json({ success: false, message: "Booking not found" });
                return;
            }

            res.status(200).json({ success: true, message: "Booking deleted", booking: deletedBooking });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async completeBooking(req: Request, res: Response): Promise<void> {
        try {
            const { bookingId } = req.body;
            if (!bookingId) {
                res.status(400).json({ success: false, message: "Booking ID is required" });
                return;
            }

            const booking = await Booking.findByIdAndUpdate(bookingId, { status: "completed" }, { new: true })
                .populate("customer")
                .populate("service")
                .populate("subService")
                .populate("employee");

            if (!booking) {
                res.status(404).json({ success: false, message: "Booking not found" });
                return;
            }

            res.status(200).json({ success: true, booking });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Cancel a booking
    async cancelBooking(req: Request, res: Response): Promise<void> {
        try {
            const { bookingId } = req.body;
            if (!bookingId) {
                res.status(400).json({ success: false, message: "Booking ID is required" });
                return;
            }

            const booking = await Booking.findByIdAndUpdate(bookingId, { status: "canceled" }, { new: true })
                .populate("customer")
                .populate("service")
                .populate("subService")
                .populate("employee");

            if (!booking) {
                res.status(404).json({ success: false, message: "Booking not found" });
                return;
            }

            res.status(200).json({ success: true, booking });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new BookingController();
