import { useState, useEffect } from "react";
import clsx from "clsx";
import { FileText, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ProfileDropdown from "../layout/ProfileDropdown";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";





const Header = () => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);

    const { isAuthenticated } = useAuth()
    console.log(isAuthenticated)

    const { user, logout } = useAuth()
    // const user: User = { name: "Azula", email: "princessAzula@gmail.com", avatar: '' };
    // const logout = () => { };

    const navigate = useNavigate()
    // Handle scroll
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 1);
        };
        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const goToDashboard = () => {
        navigate("/dashboard");
    };
    //returnreturn
    return (
        <header
            className={clsx(
                "fixed top-0 w-full z-50 transition-all duration-300 bg-gray-100",
                isScrolled ? "bg-white/95 backdrop-blur-sm shadow-lg" : "bg-white/0"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">

                    {/* Logo */}
                    <div
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log("Logo clicked, auth =", isAuthenticated);
                            if (isAuthenticated) navigate("/dashboard");
                        }}
                        className="flex items-center space-x-2 cursor-pointer"
                    >


                        <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center">
                            <FileText className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">NovaFlow</span>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-8">
                        <a
                            href="#features"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full"
                        >
                            Features
                        </a>

                        <a
                            href="#testimonals"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full"
                        >
                            Testimonals
                        </a>

                        <a
                            href="#faq"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-black after:transition-all hover:after:w-full"
                        >
                            FAQ
                        </a>
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden lg:flex items-center space-x-4">
                        {isAuthenticated && (
                            <ProfileDropdown
                                isOpen={profileDropdownOpen}
                                onToggle={(e) => {
                                    e.stopPropagation()
                                    setProfileDropdownOpen(!profileDropdownOpen)
                                }}
                                avatar={user?.avatar || ""}
                                companyName={user?.name || ""}
                                email={user?.email || ""}
                                onLogout={logout}
                            />
                        )

                        }

                        {!isAuthenticated && (
                            <>
                                <Link to="/login" className="text-black hover:text-gray-900 font-medium transition-colors duration-200">
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-linear-to-r from-blue-950 to-blue-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg"
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>


                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>

                </div>
            </div>

            {isMenuOpen && (
                <div className="lg:hidden absolute top-16 left-0 w-full bg-white shadow-lg rounded-b-2xl">
                    <div className="flex flex-col px-6 py-6 space-y-4">

                        <a
                            href="#features"
                            className="text-gray-800 text-base font-medium transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 cursor-pointer rounded-md px-3 py-2"
                        >
                            Features
                        </a>

                        <a
                            href="#testimonals"
                            className="text-gray-800 text-base font-medium transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 cursor-pointer rounded-md px-3 py-2"
                        >
                            Testimonals
                        </a>

                        <a
                            href="#faq"
                            className="text-gray-800 text-base font-medium transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 cursor-pointer rounded-md px-3 py-2"
                        >
                            FAQ
                        </a>


                        {/* Divider */}
                        <div className="border-t border-gray-200 pt-4" />

                        {isAuthenticated ? (
                            <div className="pt-2">
                                <Button
                                    className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold transition-all duration-200 hover:bg-blue-950 hover:shadow-md"
                                    onClick={goToDashboard}
                                >
                                    Go to Dashboard
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="w-full text-center py-2 text-gray-900 font-semibold transition-colors duration-200 hover:text-blue-900"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/signup"
                                    className="w-full text-center py-2 bg-blue-900 text-white rounded-lg font-semibold transition-all duration-200 hover:bg-blue-950 hover:shadow-md"
                                >
                                    Sign-Up
                                </Link>
                            </>
                        )}

                    </div>
                </div>
            )}


        </header>
    );
};

export default Header;
