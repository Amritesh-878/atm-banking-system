// Transaction constants
export const TRANSACTION = {
  CURRENCY_SYMBOL: '₹',
  MAX_WITHDRAWAL: 50000, // ₹50,000
  MIN_WITHDRAWAL: 20,    // Minimum withdrawal amount
  WITHDRAWAL_MULTIPLE: 20, // Amounts must be in multiples of 20
  MAX_DEPOSIT: 100000,   // ₹100,000
};

// Account types
export const ACCOUNT_TYPES = {
  BASIC: 'basic',
  SAVINGS: 'savings'
};

// API routes
export const API_ROUTES = {
  WITHDRAW: '/transactions/withdraw',
  DEPOSIT: '/transactions/deposit'
};
