import { Navigate, Route, Routes } from "react-router-dom";
import LoginScreen from "./components/auth/LoginScreen";
import Dashboard from "./components/dashboard/Dashboard";
import BalanceScreen from "./components/transactions/BalanceScreen";
import SuccessScreen from "./components/transactions/SuccessScreen";
import TransactionScreen from "./components/transactions/TransactionScreen";
import { AuthProvider, useAuth } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
};

const AppContent = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginScreen />
          </PublicRoute>
        }
      />

      {/* Private routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route
        path="/withdraw"
        element={
          <PrivateRoute>
            <TransactionScreen type="withdraw" />
          </PrivateRoute>
        }
      />

      <Route
        path="/deposit"
        element={
          <PrivateRoute>
            <TransactionScreen type="deposit" />
          </PrivateRoute>
        }
      />

      <Route
        path="/balance"
        element={
          <PrivateRoute>
            <BalanceScreen />
          </PrivateRoute>
        }
      />

      <Route
        path="/success"
        element={
          <PrivateRoute>
            <SuccessScreen />
          </PrivateRoute>
        }
      />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
