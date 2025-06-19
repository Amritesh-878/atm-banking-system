import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const BalanceScreen = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Basic Checking Account
              </h3>
              <span className="text-green-600 text-2xl">₹</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{currentUser.basicChecking.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Savings Account
              </h3>
              <span className="text-blue-600 text-2xl">₹</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{currentUser.savings.toLocaleString()}
            </p>
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
