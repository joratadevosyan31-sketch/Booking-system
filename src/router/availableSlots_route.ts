import express from 'express';
import { get } from 'http';
import { getAvailableSlots } from '../controller/controller_availableSlots.js';

const router = express.Router();

router.get("/available-slots", getAvailableSlots);

export default router;