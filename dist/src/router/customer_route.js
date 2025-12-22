import express from "express";
import customerController from "../controller/controller_customer.js"; // adjust path if needed
const router = express.Router();
router.get("/", customerController.getCustomers);
router.get("/one", customerController.getCustomer);
router.patch("/verify", customerController.verifyCustomer);
router.delete("/", customerController.deleteCustomer);
export default router;
