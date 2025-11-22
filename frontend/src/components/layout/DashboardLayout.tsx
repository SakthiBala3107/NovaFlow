import { Briefcase, LogOut, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { type SidebarState, type LayoutProps, type NavigationItemProps } from "../../types/date.types"
import { useIsMobile } from "../../hooks/useIsMobile"
import clsx from "clsx"
import { NAVIGATION_MENU } from "../../utils/data"
import ProfileDropdown from "./ProfileDropdown"



const NavigationItem = ({ item, isActive, onClick, isCollapsed }: NavigationItemProps) => {
    const Icon = item.icon;

    return (
        <button
            onClick={() => onClick(item.id)}
            className={clsx(
                "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group",
                isActive
                    ? "bg-blue-50 text-blue-900 shadow-sm shadow-blue-50"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
        >
            <Icon className={clsx("h-5 w-5 shrink-0", isActive ? "text-blue-900" : "text-gray-500")} />
            {!isCollapsed && <span className="ml-3 truncate">{item.name}</span>}
        </button>
    );
};




const DashboardLayout = ({ children, activeMenu }: LayoutProps) => {
    const { user, logout } = useAuth()
    const isMobile = useIsMobile()
    const navigate = useNavigate()

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState<boolean>(false)
    const [isSideBarOpen, setSideBarOpen] = useState<SidebarState>(activeMenu || "dashboard")
    const [activeNavItem, setActiveNavItem] = useState<string | number>("")

    useEffect(() => {
        const handleClickOutside = () => {
            if (isProfileDropdownOpen) setIsProfileDropdownOpen(false)
        }
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [isProfileDropdownOpen])

    const handleNavigation = (itemId: number) => {
        setActiveNavItem(itemId)
        navigate(`/${itemId}`)
        if (isMobile) setSideBarOpen(false)
    }

    const toggleSidebar = () => {
        setSideBarOpen(!setSideBarOpen)
    }

    const sidebarCollapsed = !isMobile && false

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div
                className={clsx(
                    "fixed inset-y-0 left-0 z-50 transition-transform duration-300 bg-white border-r border-gray-200 shadow-sm",
                    isMobile
                        ? isSideBarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                        : "translate-x-0",
                    sidebarCollapsed ? "w-16" : "w-64"
                )}
            >
                {/* Logo */}
                <div className="flex items-center h-16 border-b border-gray-200 px-6">
                    <Link to="/dashboard" className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-linear-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center shadow">
                            <Briefcase className="h-5 w-5 text-white" />
                        </div>
                        {!sidebarCollapsed && (
                            <span className="text-gray-900 font-bold text-xl tracking-tight">
                                NovaFlow
                            </span>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {NAVIGATION_MENU?.map((item, idx) => (
                        <NavigationItem key={item?.id || idx} item={item} isActive={activeNavItem === item?.id} onClick={handleNavigation} isCollapsed={sidebarCollapsed} />
                    ))}
                </nav>

                {/* Logout */}
                <div className="absolute bottom-4 left-4 right-4">
                    <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200"
                        onClick={logout}
                    >
                        <LogOut className="h-5 w-5" />
                        {!sidebarCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </div>

            {/* Mobile overlay */}
            {isMobile && isSideBarOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
            )}

            {/* Main content */}
            <div
                className={clsx(
                    "flex-1 flex flex-col transition-all duration-300",
                    isMobile ? "ml-0" : sidebarCollapsed ? "ml-16" : "ml-64"
                )}
            >
                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
                    {/* Left */}
                    <div className="flex items-center gap-3">
                        {isMobile && (
                            <button
                                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
                                onClick={toggleSidebar}
                            >
                                {isSideBarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        )}

                        <div>
                            <h1 className="text-lg font-semibold text-gray-800">
                                Welcome back, {user?.name}!
                            </h1>
                            <p className="text-sm text-gray-500">Here's your invoice overview.</p>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="relative">
                        {/* <ProfileDropdown /> */}

                        <ProfileDropdown
                            isOpen={isProfileDropdownOpen}
                            avatar={user?.avatar || ""}
                            companyName={user?.name || ""}
                            email={user?.email || ""}
                            onLogout={logout}
                            onToggle={(e) => { e.stopPropagation(); setIsProfileDropdownOpen(!isProfileDropdownOpen) }} />
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    )
}

export default DashboardLayout
