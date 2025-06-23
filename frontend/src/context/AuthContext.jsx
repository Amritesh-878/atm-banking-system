import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/atmService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (customerNumber, pin) => {
    try {
      const user = await authService.login(customerNumber, pin);
      setCurrentUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        //
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const updateUser = (updates) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUser,
    isAuthenticated: !!currentUser,
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
