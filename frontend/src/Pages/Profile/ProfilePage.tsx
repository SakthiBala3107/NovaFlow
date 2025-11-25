import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Building, Loader2, Mail, MapPin, Phone, User } from "lucide-react";
import toast from "react-hot-toast";
import InputField from "../../components/ui/InputField";
import TextAreaField from "../../components/ui/TextAreaField";
import type { FormState } from "../../types/data.types";
import { useUpdateProfile } from "../../hooks/UseQueries";

const ProfilePage = () => {
    const { user, isLoading, updateUser } = useAuth();
    const { mutate: updateProfile, isPending } = useUpdateProfile();

    // Initialize form data from user *once*
    const [formData, setFormData] = useState<FormState>(() => ({
        name: user?.name || "",
        businessName: user?.businessName || "",
        address: user?.address || "",
        phone: user?.phone || "",
    }));

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        updateProfile(formData, {
            onSuccess: (data) => {
                updateUser(data);
                toast.success("Saved changes");
            },
            onError: () => {
                toast.error("Something went wrong");
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-8 w-8 animate-spin">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden max-w-4xl mx-auto">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="text-lg font-semibold text-slate-900">My Profile</h3>
            </div>

            <form onSubmit={handleUpdateProfile}>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email Address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                value={user?.email || ""}
                                readOnly
                                disabled
                                className="w-full h-10 pl-10 pr-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500"
                            />
                        </div>
                    </div>

                    <InputField
                        label="Full Name"
                        name="name"
                        icon={User}
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                    />

                    <div className="pt-6 border-t border-slate-200">
                        <h4 className="text-lg font-medium text-slate-900">
                            Business Information
                        </h4>
                        <p className="text-sm text-slate-500 mt-1 mb-4">
                            This will pre-fill the 'Bill From' section in your invoices.
                        </p>

                        <div className="space-y-4">
                            <InputField
                                label="Business Name"
                                name="businessName"
                                icon={Building}
                                type="text"
                                value={formData.businessName}
                                onChange={handleInputChange}
                                placeholder="Your Company LLC"
                            />

                            <TextAreaField
                                label="Address"
                                name="address"
                                icon={MapPin}
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="123 Main Street"
                            />

                            <InputField
                                label="Phone"
                                name="phone"
                                icon={Phone}
                                type="text"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="+91 9876543210"
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex items-center justify-center px-4 py-2 h-10 bg-blue-900 hover:bg-blue-800 text-white font-medium text-sm rounded-lg disabled:opacity-50"
                    >
                        {isPending && (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        )}
                        {isPending ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage;
