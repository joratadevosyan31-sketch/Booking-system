import { Request, Response } from "express";
import { Booking } from "../model/booking.js";
import { SubService } from "../model/subService.js";
import { Employee } from "../model/employee.js";
import { BookingAbs } from "../interface/booking_abs.js";



function calculateEndTime(startTime: string, duration: number): string {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration;

    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;

    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
}



class BookingController extends BookingAbs {
    async getBookings(req: Request, res: Response): Promise<void> {
        try {
            const bookings = await Booking.find()
                .populate({ path: "customer", strictPopulate: false })
                .populate({ path: "service", strictPopulate: false })
                .populate({ path: "subServices", strictPopulate: false })
                .populate({ path: "employee", strictPopulate: false });

            const sortedBookings = bookings.sort((a, b) => {

                if (a.status === "pending" && b.status !== "pending") return -1;
                if (a.status !== "pending" && b.status === "pending") return 1;

                if (a.date > b.date) return -1;
                if (a.date < b.date) return 1;

                if (a.startTime > b.startTime) return -1;
                if (a.startTime < b.startTime) return 1;

                return 0;
            });

            res.status(200).json({
                success: true,
                bookings: sortedBookings
            });
        } catch (error: any) {
            console.error("GET BOOKINGS ERROR:", error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }





    async getBooking(req: Request, res: Response): Promise<void> {
        try {
            const { bookingId } = req.body;

            if (!bookingId) {
                res.status(400).json({
                    success: false,
                    message: "Booking ID is required"
                });
                return;
            }

            const booking = await Booking.findById(bookingId)
                .populate("customer")
                .populate("service")
                .populate("subServices")
                .populate("employee");

            if (!booking) {
                res.status(404).json({
                    success: false,
                    message: "Booking not found"
                });
                return;
            }

            res.status(200).json({ success: true, booking });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async setBooking(req: Request, res: Response): Promise<void> {


        try {
            const {
                service,
                subServices,
                employee,
                date,
                startTime
            } = req.body;

            const customer = (req as any).user.userId;
            console.log(customer);

            if (
                !service ||
                !Array.isArray(subServices) ||
                subServices.length === 0 ||
                !employee ||
                !customer ||
                !date ||
                !startTime
            ) {
                res.status(400).json({
                    success: false,
                    message: "Missing required fields"
                });
                return;
            }

            const subServiceDocs = await SubService.find({
                _id: { $in: subServices }
            });

            if (subServiceDocs.length !== subServices.length) {
                res.status(404).json({
                    success: false,
                    message: "One or more SubServices not found"
                });
                return;
            }

            const employeeData = await Employee.findById(employee);
            if (!employeeData) {
                res.status(404).json({
                    success: false,
                    message: "Employee not found"
                });
                return;
            }

            const servicesDuration = subServiceDocs.reduce(
                (sum, s) => sum + s.duration,
                0
            );

            const breakBetween = employeeData.defaultBreakBetweenServices || 5;
            const totalBreakTime = breakBetween * (subServiceDocs.length - 1);

            const endTime = calculateEndTime(
                startTime,
                servicesDuration + totalBreakTime
            );

            const booking = await Booking.create({
                service,
                subServices,
                employee,
                customer,
                date,
                startTime,
                endTime,
                status: "pending"
            });

            res.status(201).json({
                success: true,
                booking
            });

        } catch (error: any) {
            console.log(error);

            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async updateBooking(req: Request, res: Response): Promise<void> {
        try {
            const {
                bookingId,
                service,
                subServices,
                employee,
                customer,
                date,
                startTime,
                status
            } = req.body;

            if (!bookingId) {
                res.status(400).json({
                    success: false,
                    message: "Booking ID is required"
                });
                return;
            }

            const booking = await Booking.findById(bookingId);

            if (!booking) {
                res.status(404).json({
                    success: false,
                    message: "Booking not found"
                });
                return;
            }

            if (service) booking.service = service;
            if (employee) booking.employee = employee;
            if (customer) booking.customer = customer;
            if (date) booking.date = date;
            if (startTime) booking.startTime = startTime;
            if (status) booking.status = status;

            if (Array.isArray(subServices)) {
                booking.subServices = subServices;
            }

            const shouldRecalculateEndTime =
                startTime ||
                employee ||
                Array.isArray(subServices);

            if (shouldRecalculateEndTime) {
                const finalEmployeeId = employee || booking.employee;
                const finalSubServices = Array.isArray(subServices)
                    ? subServices
                    : booking.subServices;

                const employeeData = await Employee.findById(finalEmployeeId);

                if (!employeeData) {
                    res.status(404).json({
                        success: false,
                        message: "Employee not found"
                    });
                    return;
                }

                const subServiceDocs = await SubService.find({
                    _id: { $in: finalSubServices }
                });

                const breakBetween =
                    employeeData.defaultBreakBetweenServices || 5;

                const servicesDuration = subServiceDocs.reduce(
                    (sum, s) => sum + s.duration,
                    0
                );

                const totalBreakTime =
                    breakBetween * Math.max(subServiceDocs.length - 1, 0);

                booking.endTime = calculateEndTime(
                    booking.startTime,
                    servicesDuration + totalBreakTime
                );
            }

            await booking.save();

            const populatedBooking = await booking.populate([
                "customer",
                "service",
                "subServices",
                "employee"
            ]);

            res.status(200).json({
                success: true,
                booking: populatedBooking
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    async deleteBooking(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({
                    success: false,
                    message: "Booking ID is required"
                });
                return;
            }

            const deletedBooking = await Booking.findByIdAndDelete(id);

            if (!deletedBooking) {
                res.status(404).json({
                    success: false,
                    message: "Booking not found"
                });
                return;
            }


            const allBookings = await Booking.find()
                .populate({ path: "customer", strictPopulate: false })
                .populate({ path: "service", strictPopulate: false })
                .populate({ path: "subServices", strictPopulate: false })
                .populate({ path: "employee", strictPopulate: false });


            const sortedBookings = allBookings.sort((a, b) => {

                if (a.status === "pending" && b.status !== "pending") return -1;
                if (a.status !== "pending" && b.status === "pending") return 1;

                if (a.date > b.date) return -1;
                if (a.date < b.date) return 1;

                if (a.startTime > b.startTime) return -1;
                if (a.startTime < b.startTime) return 1;

                return 0;
            });

            res.status(200).json({
                success: true,
                message: "Booking deleted",
                bookings: sortedBookings
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    async completeBooking(req: Request, res: Response): Promise<void> {
        try {
            const { bookingId } = req.body;

            if (!bookingId) {
                res.status(400).json({
                    success: false,
                    message: "Booking ID is required"
                });
                return;
            }

            const booking = await Booking.findByIdAndUpdate(
                bookingId,
                { status: "completed" },
                { new: true }
            )
                .populate("customer")
                .populate("service")
                .populate("subServices")
                .populate("employee");

            if (!booking) {
                res.status(404).json({
                    success: false,
                    message: "Booking not found"
                });
                return;
            }

            res.status(200).json({ success: true, booking });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    async cancelBooking(req: Request, res: Response): Promise<void> {
        try {
            const { bookingId } = req.body;

            if (!bookingId) {
                res.status(400).json({
                    success: false,
                    message: "Booking ID is required"
                });
                return;
            }

            const booking = await Booking.findByIdAndUpdate(
                bookingId,
                { status: "canceled" },
                { new: true }
            )
                .populate("customer")
                .populate("service")
                .populate("subServices")
                .populate("employee");

            if (!booking) {
                res.status(404).json({
                    success: false,
                    message: "Booking not found"
                });
                return;
            }

            res.status(200).json({ success: true, booking });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

export default new BookingController();
