import express from "express";
import { findCustomerById } from "../services/csvService.js";

const router = express.Router();

router.get("/:id/balance", async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await findCustomerById(id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const { basicChecking, savings } = customer;

    res.json({
      basicChecking,
      savings,
      totalBalance: basicChecking + savings,
    });
  } catch (error) {
    console.error("Get balance error:", error);
    res.status(500).json({ error: "Failed to get account balance" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await findCustomerById(id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    const { pin, ...customerData } = customer;

    res.json(customerData);
  } catch (error) {
    console.error("Get account error:", error);
    res.status(500).json({ error: "Failed to get account details" });
  }
});

export default router;
