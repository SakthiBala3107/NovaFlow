import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

type DropdonwProps = {
    isOpen: boolean;
    onToggle: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
    avatar?: string;
    companyName: string;
    email: string;
    onLogout: () => void;
};

const ProfileDropdown = ({
    isOpen,
    onToggle,
    onLogout,
    avatar,
    companyName,
    email
}: DropdonwProps) => {

    const navigate = useNavigate();

    return (
        <div className="relative">
            {/* Button */}
            <button
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                onClick={onToggle}
            >
                {avatar ? (
                    <img
                        src={avatar}
                        className="h-9 w-9 object-cover rounded-xl"
                        alt="Avatar"
                    />
                ) : (
                    <div className="h-8 w-8 bg-linear-to-br from-blue-900 to-blue-800 rounded-xl flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                            {companyName.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}

                <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">{companyName}</p>
                    <p className="text-xs text-gray-500">{email}</p>
                </div>

                <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {/* BACKDROP OVERLAY → closes dropdown when clicking outside */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={(e) => onToggle(e)} // clicking anywhere closes
                />
            )}

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{companyName}</p>
                        <p className="text-xs text-gray-500">{email}</p>
                    </div>

                    <a
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer duration-200"
                        onClick={() => navigate("/profile")}
                    >
                        View Profile
                    </a>

                    <div className="border-t border-gray-100 mt-2 pt-2">
                        <a
                            className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
                            onClick={onLogout}
                        >
                            Sign out
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
