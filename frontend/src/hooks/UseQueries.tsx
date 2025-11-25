// hooks/useLogin.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPath';
import toast from 'react-hot-toast';
import type { LoginResponse, ApiError, LoginData, SignupResponse, SignupData, GetAllInvoicesResponse, DashboardSummary, InvoicePayload, InvoiceType, DashboardInvoice, UpdateInvoiceArgs, ParseInvoiceRequest, ParseInvoiceResponse, GenerateReminderParams, GenerateReminderResponse, FormState } from '../types/data.types';
import { useAuth } from '../context/AuthContext';





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
// export const useLogin = () => {
//     return useMutation<LoginResponse, ApiError, LoginData>({
//         mutationFn: async (loginData: LoginData) => {
//             const response = await axiosInstance.post<LoginResponse>(
//                 API_PATHS.AUTH.LOGIN,
//                 loginData
//             );
//             return response.data;
//         },
//         onError: (err: ApiError) => {
//             toast.error(err.message || 'Server error. Please try again.', {
//                 position: 'top-center',
//             });
//         },
//     });
// };

export const useLogin = () => {
    const { login } = useAuth();

    return useMutation<LoginResponse, ApiError, LoginData>({
        mutationFn: (data) =>
            axiosInstance.post<LoginResponse>(API_PATHS.AUTH.LOGIN, data).then(res => res.data),

        onSuccess: async (data) => {
            if (!data.token || !data.user) {
                return toast.error(data.message || "Invalid credentials");
            }

            await login(data.user, data.token);
            toast.success("Login successful!");
        },

        onError: (err) => {
            toast.error(err?.message || "Server error. Try again.");
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


//DAHSBOARD-STUFFS

//Get all the invoice details



// ---------- Hook ----------
export const useGetAllInvoices = () => {
    return useQuery<GetAllInvoicesResponse>({
        queryKey: ["invoices-all"],

        queryFn: async () => {
            const response = await axiosInstance.get<GetAllInvoicesResponse>(
                API_PATHS.INVOICE.GET_ALL_INVOICES
            );

            return response.data;
        },

        // onError: (error:ApiError ) => {
        //   toast.error(error?.message || "Failed to fetch invoices.");
        // },
    });
};


//AI-AUERIES

export const useDashboardSummary = () => {
    return useQuery<DashboardSummary>({
        queryKey: ["dashboard-summary"],
        queryFn: async () => {
            const response = await axiosInstance.get(
                API_PATHS.AI.GET_DASHBOARD_SUMMARY
            );
            return response.data;
        },
    });
};



//INVOICES
export const useCreateInvoice = () => {
    return useMutation({
        mutationFn: async (payload: InvoicePayload) => {
            const response = await axiosInstance.post(
                API_PATHS.INVOICE.CREATE,
                payload
            );
            return response.data;
        },
    });
};


//
// src/hooks/useGetInvoices.ts


export const useGetInvoices = () => {
    return useQuery<InvoiceType[]>({
        queryKey: ["invoices-list"],
        queryFn: async () => {
            const res = await axiosInstance.get<InvoiceType[]>(
                API_PATHS.INVOICE.GET_ALL_INVOICES
            );

            return res.data?.sort(
                (a, b) =>
                    new Date(b.invoiceDate).getTime() -
                    new Date(a.invoiceDate).getTime()
            );
        },
    });
};


//delete a invoice

export const useDeleteInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const res = await axiosInstance.delete(
                API_PATHS.INVOICE.DELETE_INVOICE(id)
            );
            return res.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices"] });
        },
    });
};

// update a invoice


export const useUpdateInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation<DashboardInvoice, unknown, UpdateInvoiceArgs>({
        mutationFn: async ({ id, data }: UpdateInvoiceArgs) => {
            const res = await axiosInstance.put<DashboardInvoice>(
                API_PATHS.INVOICE.UPDATE_INVOICE(id),
                data
            );
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["invoices-all"] });
            queryClient.invalidateQueries({ queryKey: ["invoices-list"] });
        },
    });
};


// ai queries





export const useParseInvoiceText = () => {
    const queryClient = useQueryClient();

    return useMutation<ParseInvoiceResponse, unknown, ParseInvoiceRequest>({
        mutationFn: async ({ text, provider }) => {
            const response = await axiosInstance.post(API_PATHS.AI.PARSE_INVOICE_TEXT, { text, provider });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invoices-all'] });
        },
        // onError: (error: ApiError) => {
        //   toast.error(error?.message || 'Failed to generate invoice.');
        // },
    });
};


//remidermodal post ->REMINDER TEXT 
// hooks/useGenerateReminder.ts




export const useGenerateReminder = () => {
    return useMutation<GenerateReminderResponse, unknown, GenerateReminderParams>({
        mutationFn: async ({ invoiceId }) => {
            const response = await axiosInstance.post(API_PATHS.AI.GENERATE_REMINDER, { invoiceId });
            return { reminderText: response.data.email };
        },
        onError: (error: unknown) => {
            const apiError = error as ApiError;
            toast.error("Failed to generate reminder. Please try again.");
            console.error("Error generating reminder:", apiError);
        },
        onSuccess: () => {
            toast.success("Reminder generated successfully!");
        },
    });
};






export const useInvoiceById = (id: string | undefined) => {
    return useQuery<InvoiceType>({
        queryKey: ["invoice", id],
        queryFn: async () => {
            if (!id) throw new Error("Missing invoice id");

            const res = await axiosInstance.get(
                API_PATHS.INVOICE.GET_INVOICE_BY_ID(id)
            );

            return res.data as InvoiceType;
        },

        enabled: !!id,

        retry: 1,


    });
};


export const useEditInvoice = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: InvoicePayload }) => {
            const response = await axiosInstance.put(
                API_PATHS.INVOICE.GET_INVOICE_BY_ID(id),
                data
            );
            return response.data as InvoiceType;
        },

        onSuccess: () => {
            toast.success("Invoice updated successfully!");

            queryClient.invalidateQueries({ queryKey: ["invoice"] });
            queryClient.invalidateQueries({ queryKey: ["invoices-all"] });
        },

        onError: () => {
            toast.error("Failed to update invoice!");
        },
    });
};



export const useUpdateProfile = () => {
    return useMutation({
        mutationFn: async (data: FormState) => {
            const res = await axiosInstance.put(API_PATHS.AUTH.UPDATE_PROFILE, data);
            return res.data;
        },
    });
};
