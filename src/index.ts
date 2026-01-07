import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import employee from './router/employee_route.js';
import service from './router/services_route.js';
import customer from './router/customer_route.js';
import booking from './router/booking_route.js';
import salon from './router/salon_route.js';
import auth from './router/auth_route.js';
import { updateFinishedBookings } from './jobs/updateFinishedBookings.js';
import statistic from './router/statistic_route.js';
import availability from './router/availability_route.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


async function connectDb() {
    try {
        await mongoose.connect('mongodb://localhost:27017/bookingService');
        console.log('Db was connected');

        setInterval(updateFinishedBookings, 60 * 1000);

        app.listen(PORT, () => {
            console.log(`App is listening on http://localhost:${PORT}`);
        });
    } catch (e) {
        console.error('Db failed', e);
    }
}

connectDb();


// app.use('/day-schedules', daySchedule);
app.use('/employees', employee);
app.use('/services', service);
app.use('/customers', customer);
app.use('/bookings', booking);
app.use('/salon', salon);
app.use('/availability', availability)
app.use('/auth', auth)
app.use("/statistics", statistic)

app.get('/', (req, res) => {
    res.send('Booking Service API is running');
});
