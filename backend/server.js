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

app.get("/api/transactions/all", (req, res) => {
  console.log("GET /api/transactions/all called"); // <-- Add this log
  const results = [];
  const filePath = path.join(__dirname, "data", "transaction_history.csv");

  // Debug: Print the file path being read
  console.log("Reading transaction history from:", filePath);

  // Check if file exists before reading
  if (!fs.existsSync(filePath)) {
    console.error("CSV file not found:", filePath);
    return res.json([]); // Return empty array if file doesn't exist
  }

  fs.createReadStream(filePath)
    .pipe(csv({ skipLines: 0, trim: true }))
    .on("data", (data) => {
      // Debug: Print each row as it's parsed
      console.log("Parsed row:", data);

      // Remove any leading/trailing whitespace from all fields
      const cleanData = {};
      Object.keys(data).forEach((key) => {
        cleanData[key.trim()] = typeof data[key] === "string" ? data[key].trim() : data[key];
      });

      // Defensive: check for header row, comments, and valid numeric id
      if (
        cleanData.account &&
        cleanData.description &&
        cleanData.amount &&
        cleanData.date &&
        cleanData.id &&
        !isNaN(Number(cleanData.id)) && // id must be a number (not header)
        cleanData.account.toLowerCase() !== "account" &&
        !cleanData.account.startsWith("#")
      ) {
        results.push({
          ...cleanData,
          amount: Number(cleanData.amount),
          balance: cleanData.balance && !isNaN(Number(cleanData.balance)) ? Number(cleanData.balance) : undefined,
          customerId: cleanData.customerId ? cleanData.customerId.trim() : undefined,
        });
      }
    })
    .on("end", () => {
      // Debug: log what is being sent to frontend
      console.log("Parsed transactions (final results):", results);
      res.json(results);
    })
    .on("error", (err) => {
      console.error("Error reading CSV:", err);
      res.status(500).json({ error: "Could not read transaction history file." });
    });
});

// Register this route BEFORE the transactionRoutes!
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

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

