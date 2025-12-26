import express from 'express';
import { authenticateAdmin } from '../middleware/adminAuth_middleware.js';
import StatisticController from "../controller/controller_statistic.js"

const statistic = express.Router()

statistic.get("/bookingStateByDay", authenticateAdmin, StatisticController.getBookingStateByday)


export default statistic