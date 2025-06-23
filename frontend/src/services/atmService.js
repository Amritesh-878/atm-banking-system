import axios from "axios";
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";
const CURRENCY_SYMBOL = "₹";
const TRANSACTION = {
  MAX_WITHDRAWAL: 50000,
  MIN_WITHDRAWAL: 20,
  WITHDRAWAL_MULTIPLE: 20,
  MAX_DEPOSIT: 100000,
};

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  login: async (customerNumber, pin) => {
    try {
      const response = await api.post("/auth/login", { customerNumber, pin });
      return response.data.customer;
    } catch (error) {
      throw new Error(
        error.response?.data?.error ||
          "Login failed. Please check your credentials and try again."
      );
    }
  },
};

export const accountService = {
  getBalance: async (customerId) => {
    try {
      const response = await api.get(`/accounts/${customerId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch account balance"
      );
    }
  },

  getAccounts: async (customerId) => {
    try {
      const response = await api.get(`/accounts/${customerId}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Failed to fetch accounts"
      );
    }
  },
};

export const transactionService = {
  withdraw: async (customerId, account, amount) => {
    try {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error("Please enter a valid amount");
      }
      if (amountNum % TRANSACTION.WITHDRAWAL_MULTIPLE !== 0) {
        throw new Error(
          `Amount must be in multiples of ${CURRENCY_SYMBOL}${TRANSACTION.WITHDRAWAL_MULTIPLE}`
        );
      }
      if (amountNum > TRANSACTION.MAX_WITHDRAWAL) {
        throw new Error(
          `Maximum withdrawal amount is ${CURRENCY_SYMBOL}${TRANSACTION.MAX_WITHDRAWAL.toLocaleString()}`
        );
      }

      const response = await api.post(`/transactions/withdraw/${customerId}`, {
        account: account.toLowerCase(),
        amount: amountNum,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || error.message || "Withdrawal failed"
      );
    }
  },

  deposit: async (customerId, account, amount) => {
    try {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error("Please enter a valid amount");
      }
      if (amountNum > TRANSACTION.MAX_DEPOSIT) {
        throw new Error(
          `Maximum deposit amount is ${CURRENCY_SYMBOL}${TRANSACTION.MAX_DEPOSIT.toLocaleString()}`
        );
      }

      const response = await api.post(`/transactions/deposit/${customerId}`, {
        account: account.toLowerCase(),
        amount: amountNum,
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || error.message || "Deposit failed"
      );
    }
  },
};

// Add request interceptor for auth if needed
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.error("Unauthorized access - redirecting to login");
      // You might want to redirect to login here
    }
    return Promise.reject(error);
  }
);

export default api;
