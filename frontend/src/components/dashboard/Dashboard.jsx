import {
  ArrowDownCircle,
  ArrowUpCircle,
  Eye,
  LogOut,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccountCard from "./AccountCard";
import TransactionButton from "./TransactionButton";

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!currentUser) {
    navigate("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <User size={24} />
            <div>
              <h2 className="font-semibold">Hello, {currentUser.name}</h2>
              <p className="text-blue-200 text-sm">Welcome back</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Account Balances */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <AccountCard
            title="Basic Checking"
            balance={currentUser.basicChecking}
          />
          <AccountCard title="Savings Account" balance={currentUser.savings} />
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <TransactionButton
            onClick={() => navigate("/withdraw")}
            icon={ArrowDownCircle}
            iconColor="text-red-500"
            title="Withdraw"
            description="Get cash from your account"
          />
          <TransactionButton
            onClick={() => navigate("/deposit")}
            icon={ArrowUpCircle}
            iconColor="text-green-500"
            title="Deposit"
            description="Add money to your account"
          />
          <TransactionButton
            onClick={() => navigate("/balance")}
            icon={Eye}
            iconColor="text-blue-500"
            title="Check Balance"
            description="View account balances"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
