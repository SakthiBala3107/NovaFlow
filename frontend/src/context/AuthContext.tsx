import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, User } from "../types/date.types";

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem("token");
            const userStr = localStorage.getItem("user");

            if (!token || !userStr) return;

            const userData: User = JSON.parse(userStr);
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Auth check failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (userData: User, token: string) => {
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

    const updateUser = async (updateUserData: Partial<User>) => {
        if (!user) return;
        const newUserData: User = { ...user, ...updateUserData };
        localStorage.setItem("user", JSON.stringify(newUserData));
        setUser(newUserData);
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated,
        checkAuthStatus,
        login,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
