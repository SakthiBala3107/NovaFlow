export const BASE_URL = "http://localhost:8000/" as const;

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/me",
    UPDATE_PROFILE: "/api/auth/me",
  },

  INVOICE: {
    CREATE: "/invoices/",
    GET_ALL_INVOICES: "/invoices/",
    GET_INVOICE_BY_ID: (id: string | number) => `/invoices/${id}`,
    UPDATE_INVOICE: (id: string | number) => `/invoices/${id}`,
    DELETE_INVOICE: (id: string | number) => `/invoices/${id}`,
  },
  AI: {
    PARSE_INVOICE_TEXT: "/ai/parse-text",
    GENERATE_REMINDER: "/ai/generate-reminder",
    GET_DASHBOARD_SUMMARY: "/ai/dashboard-summary",
  },
} as const;

export type ApiPaths = typeof API_PATHS;
