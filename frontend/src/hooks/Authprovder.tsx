import { useState, useEffect } from "react";
import type { AuthProviderProps, User, AuthContextType } from "../types/data.types";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    // const [isLogout, setIsLogout] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    // const { toggleAuth } = useAuthStore()


    const toggleIsAuthenticated = () => {
        setIsAuthenticated(true)
    }
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

    // AuthProvider.tsx
    // derived from user

    // login:
    const login = async (userData: User, token: string) => {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData); // isAuthenticated auto becomes true
        console.log(isAuthenticated, "login function")
    };

    // logout:
    const logout = async () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null); // isAuthenticated auto becomes false
        window.location.href = "/";
        console.log(isAuthenticated, "logout function")

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
        toggleIsAuthenticated
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};