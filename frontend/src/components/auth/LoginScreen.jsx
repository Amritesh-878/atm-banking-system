import { CreditCard } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginScreen = () => {
  const [customerNumber, setCustomerNumber] = useState("");
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!customerNumber || !pin) {
      setError("Please enter both customer number and PIN");
      return;
    }

    const result = await login(customerNumber, pin);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <CreditCard className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">EASY CASH ATM</h1>
          <p className="text-gray-600 mt-2">
            Welcome to your banking experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Number
            </label>
            <input
              type="text"
              value={customerNumber}
              onChange={(e) => setCustomerNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your customer number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your PIN"
            />
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Demo Customer Numbers:</p>
          <p className="text-xs text-gray-500">
            12345 (PIN: 1234) | 67890 (PIN: 5678) | 11111 (PIN: 9999)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
