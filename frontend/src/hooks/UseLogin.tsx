// hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';
import toast from 'react-hot-toast';
import type { LoginResponse, ApiError, LoginData, SignupResponse, SignupData } from '../types/date.types';





// Register payload: {
//   name: 'ALAIN',
//   email: 'testAlainX123@gmail.com',
//   password: 'TestTestTestTest123'
// }
// User exists? {
//   _id: new ObjectId('691ef3e70846665d556a693e'),
//   name: 'ALAIN',
//   email: 'testalainx123@gmail.com',
//   businessName: '',
//   phone: '',
//   address: '',
//   createdAt: 2025-11-20T10:56:39.788Z,
//   updatedAt: 2025-11-20T10:56:39.788Z,
//   __v: 0
// }



//User login [POST]
export const useLogin = () => {
    return useMutation<LoginResponse, ApiError, LoginData>({
        mutationFn: async (loginData: LoginData) => {
            const response = await axiosInstance.post<LoginResponse>(
                API_PATHS.AUTH.LOGIN,
                loginData
            );
            return response.data;
        },
        onError: (err: ApiError) => {
            toast.error(err.message || 'Server error. Please try again.', {
                position: 'top-center',
            });
        },
    });
};



// user signUp [POST]
export const useSignup = () => {
    return useMutation<SignupResponse, ApiError, SignupData>({
        mutationFn: async (signupData: SignupData) => {
            const response = await axiosInstance.post<SignupResponse>(
                API_PATHS.AUTH.REGISTER,
                signupData
            );
            return response.data;
        },
        onSuccess: () => {
            toast.success('Signup successful!', { position: 'top-center' });
        },
        onError: (err: ApiError) => {
            const message =
                err.message || 'Signup failed. Please try again.';
            toast.error(message, { position: 'top-center' });
        },
    });
};
