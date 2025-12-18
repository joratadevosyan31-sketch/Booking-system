import { Service } from "../model/service.js";
import { SubService } from "../model/subService.js";
import { Request, Response } from "express";
import { ServiceAbs } from "../interface/Service_abs.js";
import { log } from "console";


class ServiceController extends ServiceAbs {

    async getServices(req: Request, res: Response): Promise<void> {
        try {
            const services = await Service.find().populate("subServices");
            res.status(200).json({ success: true, services });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getSubServices(req: Request, res: Response): Promise<void> {
        try {
            const { serviceId, serviceName } = req.body;
            if (!serviceId && !serviceName) {
                res.status(400).json({ success: false, message: "Service ID or name is required" });
                return;
            }

            let service;
            if (serviceId) {
                service = await Service.findById(serviceId);
            } else {
                service = await Service.findOne({ name: serviceName });
            }

            if (!service) {
                res.status(404).json({ success: false, message: "Service not found" });
                return;
            }

            const subServices = await SubService.find({ service: service._id }).populate("service");
            res.status(200).json({ success: true, service, subServices });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async setService(req: Request, res: Response): Promise<void> {
        try {
            const { name, subServices } = req.body;
            if (!name) {
                res.status(400).json({ success: false, message: "Service name is required" });
                return;
            }

            const service = await Service.create({ name, subServices: subServices || [] });
            res.status(201).json({ success: true, service });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateService(req: Request, res: Response): Promise<void> {
        try {
            const { serviceId, name, subServices } = req.body;
            if (!serviceId) {
                res.status(400).json({ success: false, message: "Service ID is required" });
                return;
            }

            const updateData: any = {};
            if (name) updateData.name = name;
            if (subServices) updateData.subServices = subServices;

            const updatedService = await Service.findByIdAndUpdate(serviceId, updateData, { new: true }).populate("subServices");
            if (!updatedService) {
                res.status(404).json({ success: false, message: "Service not found" });
                return;
            }

            res.status(200).json({ success: true, service: updatedService });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async deleteService(req: Request, res: Response): Promise<void> {
        try {
            const { serviceId } = req.body;
            if (!serviceId) {
                res.status(400).json({ success: false, message: "Service ID is required" });
                return;
            }

            const deletedService = await Service.findByIdAndDelete(serviceId);
            if (!deletedService) {
                res.status(404).json({ success: false, message: "Service not found" });
                return;
            }

            await SubService.deleteMany({ service: deletedService._id });

            res.status(200).json({
                success: true,
                message: "Service deleted successfully",
                service: deletedService
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async setSubService(req: Request, res: Response): Promise<void> {
        try {
            const { name, duration, price, serviceId } = req.body;
            if (!name || !duration || !price || !serviceId) {
                res.status(400).json({ success: false, message: "Missing required fields" });
                return;
            }

            const service = await Service.findById(serviceId);
            if (!service) {
                res.status(404).json({ success: false, message: "Service not found" });
                return;
            }

            const subService = await SubService.create({ name, duration, price, service: serviceId });
            service.subServices.push(subService._id);
            await service.save();

            res.status(201).json({ success: true, subService });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async updateSubService(req: Request, res: Response): Promise<void> {
        try {
            const { subServiceId, name, duration, price } = req.body;
            if (!subServiceId) {
                res.status(400).json({ success: false, message: "SubService ID is required" });
                return;
            }

            const updateData: any = {};
            if (name) updateData.name = name;
            if (duration) updateData.duration = duration;
            if (price) updateData.price = price;

            const updatedSubService = await SubService.findByIdAndUpdate(subServiceId, updateData, { new: true }).populate("service");
            if (!updatedSubService) {
                res.status(404).json({ success: false, message: "SubService not found" });
                return;
            }

            res.status(200).json({ success: true, subService: updatedSubService });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async deleteSubService(req: Request, res: Response): Promise<void> {
        try {
            const { subServiceId } = req.body;
            if (!subServiceId) {
                res.status(400).json({ success: false, message: "SubService ID is required" });
                return;
            }

            const deletedSubService = await SubService.findByIdAndDelete(subServiceId);
            if (!deletedSubService) {
                res.status(404).json({ success: false, message: "SubService not found" });
                return;
            }

            await Service.findByIdAndUpdate(deletedSubService.service, { $pull: { subServices: deletedSubService._id } });

            res.status(200).json({
                success: true,
                message: "SubService deleted successfully",
                subService: deletedSubService
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new ServiceController();
