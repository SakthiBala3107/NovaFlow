import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, FileText, User } from 'lucide-react';
import clsx from 'clsx';

import { useSignup } from '../../hooks/UseLogin';
// import { validateEmail, validatePassword } from '../../utils/helper';

interface FormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    agreeToTerms: boolean;
}

interface FieldErrors {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeToTerms?: string;
}

interface TouchedFields {
    name?: boolean
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
    agreeToTerms?: boolean;
}

const SignUp = () => {
    const { login } = useAuth();

    const { mutate: signupMutate, isLoading: isMutating } = useSignup();

    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);



    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [touched, setTouched] = useState<TouchedFields>({});

    // Placeholder validation functions
    // ------------------- Validation Functions -------------------
    const validateName = (name: string): string | undefined => {
        if (!name) return "Name is required";
        if (name.length < 2) return "Name must be at least 2 characters";
        if (name.length > 50) return "Name must be less than 50 characters";
    };

    const validateEmail = (email: string): string | undefined => {
        if (!email) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) return "Invalid email address";
    };

    const validatePassword = (password: string): string | undefined => {
        if (!password) return "Password is required";
        if (password.length < 6) return "Password must be at least 6 characters";
    };

    const validateConfirmPassword = (
        confirmPassword: string,
        password: string
    ): string | undefined => {
        if (!confirmPassword) return "Please confirm your password";
        if (confirmPassword !== password) return "Passwords do not match";
    };

    const validateAgreeToTerms = (agree: boolean): string | undefined => {
        if (!agree) return "You must agree to the terms";
    };


    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value, type, checked } = e.target;

        const fieldValue = type === "checkbox" ? checked : value;

        setFormData((prev) => ({
            ...prev,
            [name]: fieldValue,
        }));

        if (name in touched && touched[name as keyof TouchedFields]) {
            const newFieldErrors = { ...fieldErrors };

            switch (name) {
                case "name":
                    newFieldErrors.name = validateName(fieldValue as string);
                    break;
                case "email":
                    newFieldErrors.email = validateEmail(fieldValue as string);
                    break;
                case "password":
                    newFieldErrors.password = validatePassword(fieldValue as string);
                    break;
                case "confirmPassword":
                    newFieldErrors.confirmPassword = validateConfirmPassword(
                        fieldValue as string,
                        formData.password
                    );
                    break;
                case "agreeToTerms":
                    newFieldErrors.agreeToTerms = validateAgreeToTerms(fieldValue as boolean);
                    break;
            }

            setFieldErrors(newFieldErrors);
        }
    };


    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };


    const isFormValid = () => {
        return (
            formData.name &&
            formData.email &&
            formData.password &&
            formData.confirmPassword &&
            formData.agreeToTerms &&
            Object.values(fieldErrors).every((err) => !err)
        );
    };


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault(); // prevent default form submission

        // Validate all fields
        const nameError = validateName(formData.name);
        const emailError = validateEmail(formData.email);
        const passwordError = validatePassword(formData.password);
        const confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password);
        const agreeToTermsError = validateAgreeToTerms(formData.agreeToTerms);

        // Collect all errors
        const newFieldErrors: FieldErrors = {
            name: nameError,
            email: emailError,
            password: passwordError,
            confirmPassword: confirmPasswordError,
            agreeToTerms: agreeToTermsError,
        };

        setFieldErrors(newFieldErrors); // update state with errors
        setTouched({
            name: true,
            email: true,
            password: true,
            confirmPassword: true,
            agreeToTerms: true,
        });

        // Stop submission if there is any error
        const hasError = Object.values(newFieldErrors).some((err) => !!err);
        if (hasError) return;

        // Proceed with submission using the custom hook
        window.location.href = '/dashboard';


    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 sm:p-8">
                <div className="flex flex-col items-center mb-6">
                    <FileText className="w-12 h-12 text-blue-900 mb-2" />
                    <h1 className="text-2xl font-semibold text-gray-800 mb-1">Create Your Account</h1>
                    <p className="text-gray-500 text-sm">Sign up to start using NovaFlow</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name Field */}
                    <div>
                        <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter your name"
                                value={formData.name}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={clsx(
                                    'w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                                    fieldErrors.name && touched.name ? 'border-red-500' : 'border-gray-300'
                                )}
                            />
                        </div>
                        {fieldErrors.name && touched.name && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={clsx(
                                    'w-full pl-10 pr-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                                    fieldErrors.email && touched.email ? 'border-red-500' : 'border-gray-300'
                                )}
                            />
                        </div>
                        {fieldErrors.email && touched.email && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={clsx(
                                    'w-full pl-10 pr-10 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                                    fieldErrors.password && touched.password ? 'border-red-500' : 'border-gray-300'
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(prev => !prev)}
                                className="absolute right-3 top-3 text-gray-400"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        {fieldErrors.password && touched.password && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label htmlFor="confirmPassword" className="block text-gray-700 mb-1">Confirm Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400" />
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                className={clsx(
                                    'w-full pl-10 pr-10 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                                    fieldErrors.confirmPassword && touched.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                )}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(prev => !prev)}
                                className="absolute right-3 top-3 text-gray-400"
                            >
                                {showConfirmPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        {fieldErrors.confirmPassword && touched.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Agree to Terms */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={(e) =>
                                setFormData({ ...formData, agreeToTerms: e.target.checked })
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="agreeToTerms" className="ml-2 block text-gray-700 text-sm">
                            I agree to the{' '}
                            <Link to="/terms" className="text-blue-500 hover:underline">Terms of Service</Link>{' '}
                            and{' '}
                            <Link to="/privacy" className="text-blue-500 hover:underline">Privacy Policy</Link>
                        </label>
                    </div>
                    {fieldErrors.agreeToTerms && (
                        <p className="text-red-500 text-sm mt-1">{fieldErrors.agreeToTerms}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isMutating}
                        className={clsx(
                            'cursor-pointer w-full py-3 rounded-lg bg-blue-900 text-white font-semibold text-lg hover:bg-blue-600 transition',
                            isMutating && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        {isMutating ? 'Signing up...' : 'Create Account'}
                    </button>

                </form>

                <div className="mt-6 text-center text-gray-500 text-sm">
                    <p>
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 hover:underline font-medium">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
