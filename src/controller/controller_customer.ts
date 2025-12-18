import { Request, Response } from "express";
import { Customer } from "../model/customer.js";
import { CustomerAbs } from "../interface/customer_abs.js";

class CustomerController extends CustomerAbs {

    // Get all customers
    async getCustomers(req: Request, res: Response): Promise<void> {
        try {
            const customers = await Customer.find();
            res.status(200).json({ success: true, customers });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Get a single customer by ID or phone
    async getCustomer(req: Request, res: Response): Promise<void> {
        try {
            const { customerId, phone } = req.body;
            if (!customerId && !phone) {
                res.status(400).json({ success: false, message: "Customer ID or phone is required" });
                return;
            }

            let customer;
            if (customerId) {
                customer = await Customer.findById(customerId);
            } else {
                customer = await Customer.findOne({ phone });
            }

            if (!customer) {
                res.status(404).json({ success: false, message: "Customer not found" });
                return;
            }

            res.status(200).json({ success: true, customer });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Create new customer (verified = false by default)
    async createCustomer(req: Request, res: Response): Promise<void> {
        try {
            const { phone, firebaseUid } = req.body;

            if (!phone) {
                res.status(400).json({
                    success: false,
                    message: "Phone is required"
                });
                return;
            }

            // Check if customer already exists
            const existingCustomer = await Customer.findOne({ phone });
            if (existingCustomer) {
                res.status(409).json({
                    success: false,
                    message: "Customer already exists",
                    customer: existingCustomer
                });
                return;
            }

            const customer = await Customer.create({
                phone,
                firebaseUid
                // verified will be false automatically
            });

            res.status(201).json({
                success: true,
                message: "Customer created",
                customer
            });
        } catch (error: any) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }


    // Verify customer (set verified to true)
    async verifyCustomer(req: Request, res: Response): Promise<void> {
        try {
            const { customerId } = req.body;
            if (!customerId) {
                res.status(400).json({ success: false, message: "Customer ID is required" });
                return;
            }

            const customer = await Customer.findByIdAndUpdate(
                customerId,
                { verified: true },
                { new: true }
            );

            if (!customer) {
                res.status(404).json({ success: false, message: "Customer not found" });
                return;
            }

            res.status(200).json({ success: true, customer });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    // Delete customer
    async deleteCustomer(req: Request, res: Response): Promise<void> {
        try {
            const { customerId } = req.body;
            if (!customerId) {
                res.status(400).json({ success: false, message: "Customer ID is required" });
                return;
            }

            const deletedCustomer = await Customer.findByIdAndDelete(customerId);
            if (!deletedCustomer) {
                res.status(404).json({ success: false, message: "Customer not found" });
                return;
            }

            res.status(200).json({ success: true, message: "Customer deleted", customer: deletedCustomer });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new CustomerController();
