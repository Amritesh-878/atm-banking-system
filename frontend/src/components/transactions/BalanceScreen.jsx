import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

const BalanceScreen = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State to store all transactions from the database
  const [allDbTransactions, setAllDbTransactions] = useState([]);

  // Fetch all transactions from backend/database on mount
  useEffect(() => {
    fetch("/api/transactions/all")
      .then((res) => res.json())
      .then((data) => {
        // Debug: Show what is received from backend
        console.log("Fetched transactions:", data);
        setAllDbTransactions(Array.isArray(data) ? data : []);
      })
      .catch(() => setAllDbTransactions([]));
  }, []);

  // Calculate total balance
  const totalBalance =
    (currentUser.basicChecking || 0) + (currentUser.savings || 0);

  // Helper to render transactions
  const renderTransactions = (transactions) => (
    <ul className="divide-y divide-gray-200">
      {transactions && transactions.length > 0 ? (
        transactions.map((txn, idx) => (
          <li key={idx} className="py-2 flex justify-between text-sm">
            <span>{txn.description || "Transaction"}</span>
            <span
              className={
                txn.amount >= 0 ? "text-green-600" : "text-red-600"
              }
            >
              {txn.amount >= 0 ? "+" : ""}
              ₹{txn.amount.toLocaleString()}
            </span>
          </li>
        ))
      ) : (
        <li className="py-2 text-gray-400">No transactions</li>
      )}
    </ul>
  );

  // Combine all transactions from both accounts, sorted by date descending
  const allTransactions = [
    ...(currentUser.basicCheckingTransactions || []).map((txn) => ({
      ...txn,
      account: "Basic Checking",
    })),
    ...(currentUser.savingsTransactions || []).map((txn) => ({
      ...txn,
      account: "Savings",
    })),
  ].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:bg-blue-700 p-2 rounded-lg transition-colors"
          >
            ←
          </button>
          <h2 className="font-semibold">Account Balance</h2>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <div className="grid gap-6">
          {/* Basic Checking Account */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Basic Checking Account
              </h3>
              <span className="text-green-600 text-2xl">₹</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{(currentUser.basicChecking || 0).toLocaleString()}
            </p>
            <div className="mt-4">
              <h4 className="font-medium mb-2 text-gray-700">Transactions</h4>
              {renderTransactions(currentUser.basicCheckingTransactions)}
            </div>
          </div>

          {/* Savings Account */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Savings Account
              </h3>
              <span className="text-blue-600 text-2xl">₹</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{(currentUser.savings || 0).toLocaleString()}
            </p>
            <div className="mt-4">
              <h4 className="font-medium mb-2 text-gray-700">Transactions</h4>
              {renderTransactions(currentUser.savingsTransactions)}
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-gray-50 rounded-xl shadow-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Transaction History
          </h3>
          {/* Debug: Show raw backend data */}
          <div className="bg-red-50 text-xs text-red-700 p-2 my-2 rounded">
            <strong>Debug: Raw backend data</strong>
            <pre>{JSON.stringify(allDbTransactions, null, 2)}</pre>
          </div>
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-2 px-2">Account</th>
                <th className="text-left py-2 px-2">Description</th>
                <th className="text-right py-2 px-2">Amount</th>
                <th className="text-left py-2 px-2">Date</th>
                <th className="text-right py-2 px-2">Balance</th>
                <th className="text-left py-2 px-2">Customer ID</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(allDbTransactions) && allDbTransactions.length > 0 ? (
                allDbTransactions
                  .map((txn, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="py-2 px-2">{txn.account || "-"}</td>
                      <td className="py-2 px-2">{txn.description || "-"}</td>
                      <td className={`py-2 px-2 text-right ${Number(txn.amount) >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {Number(txn.amount) >= 0 ? "+" : ""}
                        ₹{Number(txn.amount).toLocaleString()}
                      </td>
                      <td className="py-2 px-2">
                        {txn.date ? new Date(txn.date).toLocaleString() : "-"}
                      </td>
                      <td className="py-2 px-2 text-right">
                        {txn.balance ? `₹${Number(txn.balance).toLocaleString()}` : "-"}
                      </td>
                      <td className="py-2 px-2">{txn.customerId || "-"}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-2 text-gray-400 text-center">
                    No transactions
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total Balance */}
        <div className="bg-yellow-100 rounded-xl shadow-lg p-6 mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              Total Balance Available
            </h3>
            <span className="text-yellow-700 text-3xl font-bold">
              ₹{totalBalance.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors mt-6"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BalanceScreen;





