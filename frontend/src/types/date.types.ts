import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

//testtimonal stuffs
export interface NavigationItem {
  id: number;
  name: string;
  icon: LucideIcon;
}

export interface NavigationItemProps {
  item: NavigationItem;

  isActive: boolean;
  onClick: (id: number) => void; // <-- FIXED
  isCollapsed: boolean;
}

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
  id: number | string;
  name: string;
  email: string;
  token?: number | string; // optional, but you can include
  avatar?: string;
  businessName?: string;
  phone?: string;
  address?: string;
}

//zustand auth
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated?: boolean;
  toggleIsAuthenticated: () => void;
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
  token: number | string; // optional if already in data
  message?: string;
}

export interface AuthProviderProps {
  children: ReactNode;
}
export type LayoutProps = {
  children: ReactNode;
  activeMenu?: string | string[];
};

export type SidebarState = string | string[] | number | boolean;
export type StatsState = {
  totalInvoices: number | string;
  totalPaid: number | string;
  totalUnpaid: number | string;
};

export interface StatsItem {
  icon: LucideIcon;
  label: string;
  value: string | number;
  color: "blue" | "emerald" | "red";
}

export interface ColorClass {
  bg: string;
  text: string;
}

export type ColorMap = {
  [key in "blue" | "emerald" | "red"]: ColorClass;
};

export interface Invoice {
  _id: string;
  title: string;
  amount: number;
  total: number;
  status: "paid" | "unpaid" | "pending";
  createdAt: string;
  invoiceDate?: string; // <-- REQUIRED
}

export interface GetAllInvoicesResponse {
  invoices: Invoice[];
  message?: string;
}
