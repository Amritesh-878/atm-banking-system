import express from "express";
import { findCustomerById } from "../services/csvService.js";

const router = express.Router();

// Authenticate user
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    const { customerNumber, pin } = req.body;

    if (!customerNumber || !pin) {
      console.log("Missing customer number or PIN");
      return res
        .status(400)
        .json({ error: "Customer number and PIN are required" });
    }

    console.log(`Looking up customer with number: ${customerNumber}`);
    const customer = await findCustomerById(customerNumber);

    if (!customer) {
      console.log(`Customer not found: ${customerNumber}`);
      return res.status(404).json({ error: "Customer not found" });
    }

    console.log(`Found customer:`, {
      customerNumber: customer.customerNumber,
      id: customer.id,
      pinMatch: customer.pin === pin,
    });

    if (customer.pin !== pin) {
      console.log("Invalid PIN provided");
      return res.status(401).json({ error: "Invalid PIN" });
    }

    const { pin: _, ...customerData } = customer;

    res.json({
      customer: customerData,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
