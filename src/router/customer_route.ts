import express from "express";
import customerController from "../controller/controller_customer.js"; // adjust path if needed
import { authenticateAdmin } from "../middleware/adminAuth_middleware.js";

const router = express.Router();

router.get("/", authenticateAdmin, customerController.getCustomers);

router.get("/one", authenticateAdmin, customerController.getCustomer);

router.patch("/verify", customerController.verifyCustomer);

router.delete("/", authenticateAdmin, customerController.deleteCustomer);

export default router;
