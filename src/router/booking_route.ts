import express from "express";
import bookingController from "../controller/controller_booking.js";
import { authenticate } from "../middleware/auth_middleware.js";
import { authenticateAdmin } from "../middleware/adminAuth_middleware.js";

const booking = express.Router();

booking.get("/", authenticateAdmin, bookingController.getBookings);
booking.get("/one", authenticateAdmin, bookingController.getBooking);

booking.post("/reservation", authenticate, bookingController.setBooking);
booking.patch("/", authenticateAdmin, bookingController.updateBooking);
booking.delete("/:id", authenticateAdmin, bookingController.deleteBooking);

booking.patch("/complete", authenticateAdmin, bookingController.completeBooking);
booking.patch("/cancel", authenticateAdmin, bookingController.cancelBooking);

export default booking;


