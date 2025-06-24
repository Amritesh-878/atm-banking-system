import express from "express";
import { processTransaction } from "../services/csvService.js";
import { TRANSACTION, ACCOUNT_TYPES } from "../config/constants.js";

const router = express.Router();

router.post("/withdraw/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const { account, amount } = req.body;

    if (!account || (account !== "basic" && account !== "savings")) {
      return res.status(400).json({ error: "Invalid account type" });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    
    if (amountNum % TRANSACTION.WITHDRAWAL_MULTIPLE !== 0) {
      return res.status(400).json({
        error: `Withdrawal amount must be in multiples of ${TRANSACTION.CURRENCY_SYMBOL}20`,
      });
    }

    if (amountNum > TRANSACTION.MAX_WITHDRAWAL) {
      return res.status(400).json({
        error: `Maximum withdrawal limit is ${
          TRANSACTION.CURRENCY_SYMBOL
        }${TRANSACTION.MAX_WITHDRAWAL.toLocaleString()}`,
      });
    }

    const result = await processTransaction(customerId, account, -amountNum);

  
    const transactionDate = new Date().toISOString();

    res.json({
      success: true,
      message: "Withdrawal successful",
      newBalance: result.newBalance,
      transaction: {
        type: "withdrawal",
        account: account === ACCOUNT_TYPES.BASIC ? "Basic Checking" : "Savings",
        amount: amountNum,
        currency: "INR",
        timestamp: transactionDate,
      },
      date: transactionDate, 
    });
  } catch (error) {
    console.error("Withdrawal error:", error);

    if (error.message === "Insufficient funds") {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    if (error.message === "Customer not found") {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(500).json({ error: "Failed to process withdrawal" });
  }
});

router.post("/deposit/:customerId", async (req, res) => {
  try {
    const { customerId } = req.params;
    const { account, amount } = req.body;

    if (
      !account ||
      (account !== ACCOUNT_TYPES.BASIC && account !== ACCOUNT_TYPES.SAVINGS)
    ) {
      return res.status(400).json({ error: "Invalid account type" });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: "Please enter a valid amount" });
    }

    if (amountNum > TRANSACTION.MAX_DEPOSIT) {
      return res.status(400).json({
        error: `Maximum deposit limit is ${
          TRANSACTION.CURRENCY_SYMBOL
        }${TRANSACTION.MAX_DEPOSIT.toLocaleString()}`,
      });
    }

    const result = await processTransaction(customerId, account, amountNum);

    
    const transactionDate = new Date().toISOString();

    res.json({
      success: true,
      message: "Deposit successful",
      newBalance: result.newBalance,
      transaction: {
        type: "deposit",
        account: account === ACCOUNT_TYPES.BASIC ? "Basic Checking" : "Savings",
        amount: amountNum,
        currency: "INR",
        timestamp: transactionDate, 
      },
      date: transactionDate, 
    });
  } catch (error) {
    console.error("Deposit error:", error);
    if (error.message === "Customer not found") {
      return res.status(404).json({ error: "Account not found" });
    }
    res.status(500).json({
      error: error.message || "Failed to process deposit. Please try again.",
    });
  }
});

export default router;
