import type { ReactNode } from "react"
import { Navigate, Outlet } from "react-router-dom"
import DashboardLayout from "../layout/DashboardLayout"
import { useAuth } from "../../context/AuthContext"


type ChildrenProps = {
    children?: ReactNode


}






const ProtectedRoute = ({ children }: ChildrenProps) => {


    // const { isAuthenticated } = useAuthStore()
    const { isAuthenticated, isLoading } = useAuth()
    // const isAuthenticated = true


    // Guard clause
    if (!isAuthenticated) return <Navigate to='/' replace />

    if (isLoading) {

        return (
            <div className="flex justify-center items-center">
                <div className="w-6 h-6 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    //    renderin0stuffs
    return (


        <DashboardLayout>{children ? children : <Outlet />}</DashboardLayout>
    )
}

export default ProtectedRoute