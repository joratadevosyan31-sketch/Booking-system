import { Request, Response } from "express";

export abstract class SalonAbs {
    abstract getSalon(req: Request, res: Response): Promise<void>;
    abstract updateSalon(req: Request, res: Response): Promise<void>;
}
