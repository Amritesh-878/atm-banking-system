import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_FILE =
  process.env.CSV_FILE_PATH || path.join(__dirname, "../data/customers.csv");

// Read customers from CSV file
export const readCustomersFromCSV = async () => {
  try {
    const data = await fs.readFile(CSV_FILE, "utf-8");
    const lines = data.trim().split("\n");

    return lines.map((line) => {
      const [customerNumber, name, pin, basicChecking, savings] = line
        .split(",")
        .map((item) => item.trim());
      return {
        id: customerNumber,
        customerNumber,
        name,
        pin,
        basicChecking: parseInt(basicChecking, 10),
        savings: parseInt(savings, 10),
      };
    });
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error(
        "Customer data file not found. Creating a new one with sample data."
      );
      await initializeSampleData();
      return readCustomersFromCSV();
    }
    throw error;
  }
};

const writeCustomersToCSV = async (customers) => {
  const csvContent = customers
    .map(
      (customer) =>
        `${customer.id},${customer.name},${customer.pin},${customer.basicChecking},${customer.savings}`
    )
    .join("\n");

  await fs.writeFile(CSV_FILE, csvContent, "utf-8");
};

// Initialize sample data if file doesn't exist
const initializeSampleData = async () => {
  const sampleData = [
    "12345,John Doe,1234,5000,10000",
    "67890,Jane Smith,5678,3000,7500",
    "11111,Bob Johnson,9999,2000,5000",
    "22222,Alice Williams,1111,8000,12000",
    "33333,Charlie Brown,2222,1500,3000",
    "44444,Diana Prince,3333,6000,9000",
    "55555,Edward Davis,4444,4000,6500",
    "66666,Fiona Green,5555,2500,4000",
    "77777,George Miller,6666,7000,11000",
    "88888,Hannah White,7777,3500,5500",
  ].join("\n");

  // Create data directory if it doesn't exist
  await fs.mkdir(path.dirname(CSV_FILE), { recursive: true });
  await fs.writeFile(CSV_FILE, sampleData, "utf-8");
};

// Update customer data
export const updateCustomer = async (customerId, updates) => {
  const customers = await readCustomersFromCSV();
  const customerIndex = customers.findIndex((c) => c.id === customerId);

  if (customerIndex === -1) {
    throw new Error("Customer not found");
  }

  customers[customerIndex] = { ...customers[customerIndex], ...updates };
  await writeCustomersToCSV(customers);

  return customers[customerIndex];
};

// Find customer by ID or customerNumber
export const findCustomerById = async (customerId) => {
  const customers = await readCustomersFromCSV();
  return customers.find(
    (c) => c.id === customerId || c.customerNumber === customerId
  );
};

// Process transaction
export const processTransaction = async (customerId, accountType, amount) => {
  const customers = await readCustomersFromCSV();
  const customerIndex = customers.findIndex((c) => c.id === customerId);

  if (customerIndex === -1) {
    throw new Error("Customer not found");
  }

  const customer = customers[customerIndex];
  const accountField = accountType === "basic" ? "basicChecking" : "savings";

  // Update balance
  customer[accountField] += amount;

  // Save changes
  await writeCustomersToCSV(customers);

  return {
    newBalance: customer[accountField],
    customer,
  };
};
