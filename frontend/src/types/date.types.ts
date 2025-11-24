import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes, ReactNode } from "react";

/* ------------------- NAVIGATION / UI STUFF ------------------- */

export interface NavigationItem {
  id: number;
  name: string;
  icon: LucideIcon;
}

export interface NavigationItemProps {
  item: NavigationItem;
  isActive: boolean;
  onClick: (id: number) => void;
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

/* ------------------- GENERAL USER TYPES ------------------- */

export interface BaseUser {
  id?: string | number;
  _id?: string;
  name: string;
  email: string;
  token?: string | number;
  avatar?: string;
  businessName?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

/* ------------------- AUTH / LOGIN ------------------- */

export interface AuthContextType {
  user: BaseUser | null;
  isLoading: boolean;
  isAuthenticated?: boolean;
  toggleIsAuthenticated: () => void;
  checkAuthStatus: () => Promise<void>;
  login: (userData: BaseUser, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updateUserData: Partial<BaseUser>) => Promise<void>;
}

export interface ApiError {
  message: string;
  response?: string;
  data?: string;
  status?: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: BaseUser;
  token: string;
  message?: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  user?: BaseUser;
  data: {
    id?: string;
    name: string;
    email: string;
  };
  token: number | string;
  message?: string;
}

export interface AuthProviderProps {
  children: ReactNode;
}

/* ------------------- DASHBOARD / STATS ------------------- */

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

/* ------------------- DASHBOARD PREVIEW INVOICE ------------------- */

export interface DashboardInvoice {
  _id: string;
  title: string;
  amount: number;
  total: number;
  status: "paid" | "unpaid" | "pending";
  createdAt: string;
  invoiceDate?: string;
}

export interface GetAllInvoicesResponse {
  invoices: DashboardInvoice[];
  message?: string;
}

export type InsightsState = string[] | number[] | null;

export interface DashboardSummary {
  success?: boolean | null;
  provider?: string | null;
  message?: string | null;
  data?: {
    totalInvoices?: number | null;
    paidInvoices?: number | null;
    unpaidInvoices?: number | null;
    totalRevenue?: number | null;
    totalOutstanding?: number | null;

    recentInvoices?: Array<{
      id?: string | null;
      invoiceNumber?: string | null;
      total?: number | null;
      status?: string | null;
      date?: string | null;
    }> | null;

    insights?: string[] | null;

    summaryText?: string | null;
  } | null;
}

/* ------------------- INPUT COMPONENT PROPS ------------------- */

export interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  icon?: LucideIcon;
}

export type SelectOption =
  | string
  | { label?: string | null; value?: string | null }
  | null;

export interface SelectedFieldProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  icon?: LucideIcon;
  options?: SelectOption[] | null;
}

export type TextFieldAreaProps = {
  label?: string | null;
  name: string;
  icon?: LucideIcon | null;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

/* ------------------- API INVOICE SCHEMA (REAL BACKEND) ------------------- */

export interface InvoiceItem {
  _id: string;
  quantity: number;
  unitPrice: number;
  taxPercent: number;
  total: number;
}

export interface BillInfo {
  businessName?: string;
  clientName?: string;
  email: string;
  address: string;
  phone: string;
}

export interface InvoiceUser {
  _id: string;
  name: string;
  email: string;
}

export interface InvoiceType {
  _id: string;
  user: InvoiceUser;

  billFrom: BillInfo;
  billTo: BillInfo;

  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string | null;

  items: InvoiceItem[];

  notes: string;
  paymentTerms: string;
  status: "Paid" | "Unpaid" | "Overdue" | "Pending";

  subtotal: number;
  taxTotal: number;
  total: number;

  createdAt: string;
  updatedAt: string;
  __v: number;
}

/* ------------------- CREATE INVOICE PAYLOAD ------------------- */

export interface InvoicePayload {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string | null;

  billFrom: BillInfo;
  billTo: BillInfo;

  items: InvoiceItem[];

  subtotal: number;
  taxTotal: number;
  total: number;

  notes?: string;
  paymentTerms?: string;
}

/* ------------------- MODAL PROPS ------------------- */
export interface AIModalProps {
  isOpen: boolean;
  onclose: () => void;
  invoiceId?: string | number | undefined;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface InvoiceStatusPayload {
  status: "Paid" | "Unpaid" | "Overdue" | "Pending";
}
