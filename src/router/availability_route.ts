import express from 'express';
import { AvailabilityController } from '../controller/controller_availability.js';

const availability = express.Router();

const availabilityController = new AvailabilityController();

availability.get("/booking-availability", availabilityController.getBookingAvailability.bind(availabilityController));
availability.get("/available-slots", availabilityController.getEmployeeSlots.bind(availabilityController));

export default availability;
