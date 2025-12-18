import { Request, Response } from "express";

export abstract class BookingAbs {
    abstract getBookings(req: Request, res: Response): Promise<void>;
    abstract getBooking(req: Request, res: Response): Promise<void>;
    abstract setBooking(req: Request, res: Response): Promise<void>;
    abstract updateBooking(req: Request, res: Response): Promise<void>;
    abstract deleteBooking(req: Request, res: Response): Promise<void>;
    abstract completeBooking(req: Request, res: Response): Promise<void>;
    abstract cancelBooking(req: Request, res: Response): Promise<void>;

}