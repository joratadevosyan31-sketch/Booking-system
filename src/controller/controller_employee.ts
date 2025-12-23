import { Service } from '../model/service.js';
import { Employee } from '../model/employee.js';
import { EmployeeAbs } from "../interface/employee_abs.js";
import { Request, Response } from 'express';
import { Salon } from '../model/salon.js';


class ControllEmployee extends EmployeeAbs {
    async GetEmployees(req: Request, res: Response): Promise<void> {
        try {
            const employees = await Employee.find().populate("services").populate("subServices");
            res.status(200).json({
                employees
            })

        } catch (e) {
            res.status(504).json({
                message: "Error service issue"
            })
            console.error(`Error: ${e}`)

        }
        return;
    }

    async GetEmployeeByService(req: Request, res: Response): Promise<void> {
        try {
            const { serviceName } = req.body;

            if (!serviceName) {
                res.status(400).json({ success: false, message: "Service name is required" });
                return;
            }

            const service = await Service.findOne({ name: serviceName });
            if (!service) {
                res.status(404).json({ success: false, message: "Service not found" });
                return;
            }

            const employees = await Employee.find({ services: service._id }).populate("services").populate("subServices");

            if (employees.length === 0) {
                res.status(404).json({ success: false, message: "No employees found for this service" });
                return;
            }


            res.status(200).json({
                success: true,
                employees
            });

        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async GetSpecificEmployee(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.params;

            if (!employeeId) {
                res.status(400).json({ success: false, message: "Employee ID is required" });
                return;
            }

            const employee = await Employee.findById(employeeId).populate("services").populate("subServices");

            if (!employee) {
                res.status(404).json({ success: false, message: "Employee not found" });
                return;
            }


            res.status(200).json({ success: true, employee });

        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async SetEmployee(req: Request, res: Response): Promise<void> {
        try {
            const {
                name,
                profession,
                img,
                services,
                subServices,
                workStart,
                workEnd,
                mainBreakStart,
                mainBreakEnd,
                defaultBreakBetweenServices
            } = req.body;


            if (!name || !profession || !img || !services || !workStart || !workEnd) {
                res.status(400).json({ success: false, message: "Missing required fields" });
                return;
            }

            const salon = await Salon.findOne();
            if (!salon) {
                res.status(500).json({ success: false, message: "Salon settings not found" });
                return;
            }

            const newEmployee = await Employee.create({
                name,
                profession,
                img,
                services,
                subServices: subServices || [],
                workStart,
                workEnd,
                mainBreakStart: mainBreakStart ?? salon.mainBreakStart,
                mainBreakEnd: mainBreakEnd ?? salon.mainBreakEnd,
                defaultBreakBetweenServices:
                    defaultBreakBetweenServices ?? salon.defaultBreakBetweenServices
            });

            res.status(201).json({
                success: true,
                employee: newEmployee
            });

        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async UpdateEmployee(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId, name, profession, img, services, subServices, workStart, workEnd, mainBreakStart, mainBreakEnd, defaultBreakBetweenServices } = req.body;


            if (!employeeId) {
                res.status(400).json({ success: false, message: "Employee ID is required" });
                return;
            }


            const updateData: any = {};
            if (name) updateData.name = name;
            if (profession) updateData.profession = profession;
            if (img) updateData.img = img;
            if (services) updateData.services = services;
            if (subServices !== undefined) updateData.subServices = subServices;
            if (workStart) updateData.workStart = workStart;
            if (workEnd) updateData.workEnd = workEnd;
            if (mainBreakStart !== undefined) updateData.mainBreakStart = mainBreakStart;
            if (mainBreakEnd !== undefined) updateData.mainBreakEnd = mainBreakEnd;
            if (defaultBreakBetweenServices !== undefined) updateData.defaultBreakBetweenServices = defaultBreakBetweenServices;

            // 3️⃣ Update employee
            const updatedEmployee = await Employee.findByIdAndUpdate(
                employeeId,
                updateData,
                { new: true } // return the updated document
            ).populate("services").populate("subServices");

            if (!updatedEmployee) {
                res.status(404).json({ success: false, message: "Employee not found" });
                return;
            }

            // 4️⃣ Success
            res.status(200).json({ success: true, employee: updatedEmployee });

        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async DelateEmployee(req: Request, res: Response): Promise<void> {
        try {
            const { employeeId } = req.body;


            if (!employeeId) {
                res.status(400).json({ success: false, message: "Employee ID is required" });
                return;
            }


            const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

            if (!deletedEmployee) {
                res.status(404).json({ success: false, message: "Employee not found" });
                return;
            }


            res.status(200).json({
                success: true,
                message: "Employee deleted successfully",
                employee: deletedEmployee
            });

        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

}

export default new ControllEmployee();