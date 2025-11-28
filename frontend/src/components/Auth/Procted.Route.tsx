import { Navigate, Outlet } from "react-router-dom"
import DashboardLayout from "../layout/DashboardLayout"
import { useAuth } from "../../context/AuthContext"
import type { ChildrenProps } from "../../types/data.types";









const ProtectedRoute = ({ children }: ChildrenProps) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return (
        <DashboardLayout>
            {children || <Outlet />}
        </DashboardLayout>
    );
};


export default ProtectedRoute