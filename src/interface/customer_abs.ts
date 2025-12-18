import { Request, Response } from "express";

export abstract class CustomerAbs {
    abstract getCustomers(req: Request, res: Response): Promise<void>;
    abstract getCustomer(req: Request, res: Response): Promise<void>;
    abstract verifyCustomer(req: Request, res: Response): Promise<void>;
    abstract deleteCustomer(req: Request, res: Response): Promise<void>;
}
