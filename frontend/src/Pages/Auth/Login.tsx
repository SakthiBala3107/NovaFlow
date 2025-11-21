import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, FileText, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { validateEmail, validatePassword } from '../../utils/helper';
import { useLogin } from '../../hooks/UseLogin';
import toast from 'react-hot-toast';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { mutate: loginMutate, isLoading: isMutating } = useLogin();


    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
    const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };


    const isFormValid = () => {
        const errors: { email?: string; password?: string } = {};

        const emailError = validateEmail(formData.email);
        if (emailError) errors.email = emailError;

        const passwordError = validatePassword(formData.password);
        if (passwordError) errors.password = passwordError;

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };



    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid()) return;

        loginMutate(formData, {
            onSuccess: async (data) => {
                if (data.user && data.token) {
                    // Store user and token in localStorage & context
                    const userWithId = { ...data.user, id: data.user._id ?? data.user.id };
                    await login(userWithId, data.token);

                    toast.success('Login successful!', { position: 'top-center' });
                    navigate('/dashboard');
                } else {
                    setFieldErrors({ email: data.message || 'Invalid credentials' });
                }
            },
        });
    };









    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6 sm:p-8">
                <div className="flex flex-col items-center mb-6">
                    <FileText className="w-12 h-12 text-blue-900 mb-2" />
                    <h1 className="text-2xl font-semibold text-gray-800 mb-1">Login to Your Account</h1>
                    <p className="text-gray-500 text-sm">Welcome back to NovaFlow</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
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
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-3 text-gray-400"
                            >
                                {showPassword ? <EyeOff /> : <Eye />}
                            </button>
                        </div>
                        {fieldErrors.password && touched.password && (
                            <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isMutating}
                        className={clsx(
                            'cursor-pointer w-full py-3 rounded-lg bg-blue-900 text-white font-semibold text-lg hover:bg-blue-600 transition',
                            isMutating && 'opacity-50 cursor-not-allowed'
                        )}
                    >
                        {isMutating ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center text-gray-500 text-sm">
                    <p>
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-blue-500 hover:underline font-medium">
                            Sign Up
                        </Link>
                    </p>
                    <p className="mt-2">
                        <Link to="/forgot-password" className="text-blue-500 hover:underline font-medium">
                            Forgot Password?
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
