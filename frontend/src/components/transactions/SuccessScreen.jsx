import { CheckCircle, Receipt } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CURRENCY_SYMBOL = "₹";

const SuccessScreen = () => {
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
    []
  );
  const navigate = useNavigate();
  const { state } = useLocation();
  const [showReceipt, setShowReceipt] = useState(false);

  const transaction = state || {
    type: "Transaction",
    accountType: "basic",
    amount: 0,
    newBalance: 0,
  };

  const accountDisplayName =
    transaction.accountType === "basic" ? "Basic Checking" : "Savings Account";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-green-500 mb-4">
          <CheckCircle className="w-16 h-16 mx-auto" />
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {transaction.type} Successful!
        </h3>
        <p className="text-gray-600 mb-6">
          Your transaction has been completed successfully.
        </p>

        <div className="space-y-2 mb-6">
          <button
            onClick={() => setShowReceipt(!showReceipt)}
            className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition-colors"
          >
            <Receipt size={16} className="mr-2" />
            {showReceipt ? "Hide" : "Show"} Receipt
          </button>

          {showReceipt && (
            <div className="bg-gray-50 p-4 rounded-lg text-left">
              <h4 className="font-semibold mb-2">Transaction Receipt</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">Type:</span> {transaction.type}
                </p>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Account:</span>
                  <span className="font-medium">{accountDisplayName}</span>
                </div>
                <p>
                  <span className="font-medium">Amount:</span>{" "}
                  {formatAmount(transaction.amount)}
                </p>
                <p>
                  <span className="font-medium">Balance:</span>{" "}
                  {formatAmount(transaction.newBalance)}
                </p>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
