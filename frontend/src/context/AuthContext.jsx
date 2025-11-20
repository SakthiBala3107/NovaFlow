import {
  Children,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used withing an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      //GUARD CLAUSE
      if (!token && !userStr) return;
      //   setIsLoading(true);

      const userData = JSON.parse(userStr);
      setUser(userData);
      setIsAuthenticated(true);

      //
    } catch (error) {
      console.error("Auth chek failed:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const login = async (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    setUser(userData);
    setIsAuthenticated(true);
  };
  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };
  const updateUser = async (updateUserData) => {
    const newUserData = { ...user, ...updateUserData };
    localStorage.setItem("user", JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated,
    checkAuthStatus,
    login,
    logout,
    updateUser,
  };
  //RENDERING-STUFFS
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
