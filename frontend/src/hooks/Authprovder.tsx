import { useState, useEffect } from "react";
import type { AuthProviderProps, User, AuthContextType } from "../types/data.types";
import { AuthContext } from "../context/AuthContext";

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

            if (token && userStr) {
                const userData: User = JSON.parse(userStr);
                setUser(userData);
                setIsAuthenticated(true);
            }
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
        localStorage.removeItem("user");

        setUser(null);
        setIsAuthenticated(false);

        window.location.href = "/";
    };

    const updateUser = async (updateUserData: Partial<User>) => {
        if (!user) return;

        const newUserData = { ...user, ...updateUserData };
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
        toggleIsAuthenticated: () => setIsAuthenticated(true),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
