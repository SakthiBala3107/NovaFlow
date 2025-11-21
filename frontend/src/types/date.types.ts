import type { LucideIcon } from "lucide-react";

//testtimonal stuffs
export type Feature = {
  icon?: LucideIcon;
  title: string;
  description: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  title: string;
  avatar: string;
};

export type FAQ = {
  question: string;
  answer: string;
};

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

//zustand auth
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  checkAuthStatus: () => Promise<void>;
  login: (userData: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updateUserData: Partial<User>) => Promise<void>;
}

export interface ApiError {
  message: string;
}

// signup-page----------------//

export interface MyFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

export interface TouchedFields {
  name?: boolean;
  email?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
  agreeToTerms?: boolean;
}

//LOGIN
export interface LoginData {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  businessName?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  message?: string;
}

export interface ApiError {
  message: string;
  response?: string;
  data?: string;
  status?: number;
}

//login post method
export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  user?: User;
  data: {
    id?: string;
    // _id?: string;
    name: string;
    email: string;
  };
  token: string; // optional if already in data
  message?: string;
}
