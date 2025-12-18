import { Request, Response } from "express";

export abstract class ServiceAbs {
    abstract getServices(req: Request, res: Response): Promise<void>;
    abstract getSubServices(req: Request, res: Response): Promise<void>;
    abstract setService(req: Request, res: Response): Promise<void>;
    abstract updateService(req: Request, res: Response): Promise<void>;
    abstract deleteService(req: Request, res: Response): Promise<void>;
    abstract setSubService(req: Request, res: Response): Promise<void>;
    abstract updateSubService(req: Request, res: Response): Promise<void>;
    abstract deleteSubService(req: Request, res: Response): Promise<void>;
}
