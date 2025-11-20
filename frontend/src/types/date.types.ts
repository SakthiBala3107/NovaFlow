import type { LucideIcon } from "lucide-react";

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
