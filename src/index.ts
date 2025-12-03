import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import employee from '../router/employee_route.js';
import service from '../router/services_route.js';

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

async function connectDb() {
    try {
        await mongoose.connect('mongodb://localhost:27017/booking');
        console.log('Db was connected');
        app.listen(PORT , () => {
            console.log(`app is listend on url http://localhost:${PORT}`)
        })
        
    }catch (e) {
        console.error('Db failed')
    }
}
connectDb();

app.use('/employees' , employee);
app.use('/services' , service);
