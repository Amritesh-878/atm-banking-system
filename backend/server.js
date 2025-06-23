import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import accountRoutes from "./routes/accounts.js";
import transactionRoutes from "./routes/transactions.js";
import { readCustomersFromCSV } from "./services/csvService.js";
import fs from "fs";
import csv from "csv-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

app.get("/api/transactions/all", (req, res) => {
  const results = [];
  // This line connects to the transaction_history.csv file
  const filePath = path.join(__dirname, "data", "transaction_history.csv");
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      if (
        data.account &&
        data.description &&
        data.amount &&
        data.date
      ) {
        results.push({
          ...data,
          amount: Number(data.amount),
          balance: data.balance ? Number(data.balance) : undefined,
        });
      }
    })
    .on("end", () => {
      // This line prints the transactions to your backend console
      console.log("Sending transactions:", results);
      res.json(results);
    })
    .on("error", (err) => {
      res.status(500).json({ error: "Could not read transaction history file." });
    });
});

import errorHandler from "./middleware/errorHandler.js";

app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

const initializeData = async () => {
  try {
    const customers = await readCustomersFromCSV();
    console.log(`Successfully loaded ${customers.length} customers`);
  } catch (error) {
    console.error("Failed to initialize data:", error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await initializeData();

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

