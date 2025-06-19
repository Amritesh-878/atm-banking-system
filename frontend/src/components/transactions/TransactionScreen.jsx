/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { transactionService } from "../../services/atmService";
import QuickAmountButtons from "./QuickAmountButtons";

const CURRENCY_SYMBOL = "₹";
const TRANSACTION = {
  MAX_WITHDRAWAL: 50000,
  WITHDRAWAL_MULTIPLE: 20,
  MAX_DEPOSIT: 100000,
};

const TransactionScreen = ({ type = "withdraw" }) => {
  const formatAmount = useMemo(
    () => (value) => {
      return `${CURRENCY_SYMBOL}${parseFloat(value || 0).toLocaleString(
        "en-IN",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }
      )}`;
    },
    [CURRENCY_SYMBOL]
  );

  const { currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTransaction = async () => {
    setError("");

    if (!selectedAccount) {
      setError("Please select an account");
      return;
    }

    if (!amount) {
      setError("Please enter an amount");
      return;
    }

    const transactionAmount = parseFloat(amount);

    if (isNaN(transactionAmount) || transactionAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    if (type === "withdraw") {
      const currentBalance =
        selectedAccount === "basic"
          ? currentUser.basicChecking
          : currentUser.savings;

      if (transactionAmount > currentBalance) {
        setError("Insufficient funds");
        return;
      }

      if (transactionAmount % 20 !== 0) {
        setError("Withdrawal amount must be in multiples of 20");
        return;
      }
    }

    setIsProcessing(true);

    try {
      let response;
      if (type === "withdraw") {
        response = await transactionService.withdraw(
          currentUser.customerNumber,
          selectedAccount,
          transactionAmount
        );
      } else {
        response = await transactionService.deposit(
          currentUser.customerNumber,
          selectedAccount,
          transactionAmount
        );
      }

      console.log("Transaction response:", response); // Debug log

      if (response && response.success) {
        // Update user balance in the context
        updateUser({
          [selectedAccount === "basic" ? "basicChecking" : "savings"]:
            response.newBalance,
        });

        // Navigate to success screen with transaction details
        navigate("/success", {
          state: {
            type,
            amount: transactionAmount,
            accountType: selectedAccount,
            newBalance: response.newBalance,
            transactionId: response.transactionId,
          },
        });
      } else {
        throw new Error(response?.error || "Transaction failed");
      }
    } catch (error) {
      console.error("Transaction error:", error);
      setError(error.message || "Transaction failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:bg-blue-700 p-2 rounded-lg transition-colors"
            disabled={isProcessing}
          >
            ←
          </button>
          <h2 className="font-semibold capitalize">
            {type === "withdraw" ? "Withdraw" : "Deposit"} Money
          </h2>
        </div>
      </div>

      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-6">Select Account</h3>

          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => setSelectedAccount("basic")}
              disabled={isProcessing}
              className={`w-full p-4 rounded-lg border-2 transition-colors ${
                selectedAccount === "basic"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Basic Checking</span>
                <span className="text-gray-600">
                  {currentUser.basicChecking.toLocaleString()}
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedAccount("savings")}
              disabled={isProcessing}
              className={`w-full p-4 rounded-lg border-2 transition-colors ${
                selectedAccount === "savings"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">Savings Account</span>
                <span className="text-gray-600">
                  {currentUser.savings.toLocaleString()}
                </span>
              </div>
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="0"
              step={type === "withdraw" ? "20" : "1"}
              disabled={isProcessing}
            />
          </div>

          {type === "withdraw" && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Quick amounts (₹):</p>
              <QuickAmountButtons
                onSelect={setAmount}
                disabled={isProcessing}
              />
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-2 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleTransaction}
            disabled={isProcessing || !selectedAccount || !amount}
            className={`w-full py-3 px-6 rounded-lg font-medium text-white ${
              isProcessing || !selectedAccount || !amount
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition-colors`}
          >
            {isProcessing
              ? "Processing..."
              : type === "withdraw"
              ? "Withdraw"
              : "Deposit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionScreen;
