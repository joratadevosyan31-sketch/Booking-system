import express from "express";
import bookingController from "../controller/controller_booking.js";

const router = express.Router();

router.get("/", bookingController.getBookings);
router.get("/one", bookingController.getBooking);

router.post("/", bookingController.setBooking);
router.patch("/", bookingController.updateBooking);

router.delete("/", bookingController.deleteBooking);

router.patch("/complete", bookingController.completeBooking);
router.patch("/cancel", bookingController.cancelBooking);

export default router;
