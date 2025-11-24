import {
  Sparkles,
  BarChart2,
  Mail,
  FileText,
  Plus,
  LayoutDashboard,
  Users,
  Cpu,
} from "lucide-react";
import type {
  FAQ,
  Feature,
  NavigationItem,
  ProvidersProps,
  Testimonial,
} from "../types/data.types";

export const FEATURES: Feature[] = [
  {
    icon: Sparkles,
    title: "AI Invoice Creation",
    description:
      "Paste any text, email, or receipt, and let our AI instantly create a clean, ready-to-send invoice in seconds.",
  },
  {
    icon: BarChart2,
    title: "AI-Powered Dashboard",
    description:
      "Get instant insights on your invoices, payments, and cashflow with a smart, AI-driven dashboard.",
  },
  {
    icon: Mail,
    title: "Smart Reminders",
    description:
      "Automatically send gentle reminders for due payments, keeping your clients on track effortlessly.",
  },
  {
    icon: FileText,
    title: "Easy Invoice Management",
    description:
      "Create, edit, and organize all your invoices in one place, with AI helping you stay efficient and accurate.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "This app saved me hours of work. I can now create and send invoices in minutes!",
    author: "Zuko",
    title: "Freelance Designer",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=ZK",
  },
  {
    quote:
      "NovaFlow has completely streamlined our invoicing process. No more late payments!",
    author: "Katara",
    title: "Small Business Owner",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=KT",
  },
  {
    quote:
      "The AI reminders are a game-changer. I don’t have to chase clients anymore.",
    author: "Toph",
    title: "Project Manager",
    avatar: "https://placehold.co/100x100/000000/ffffff?text=TP",
  },
];

export const FAQS: FAQ[] = [
  {
    question: "How does Novaflow work?",
    answer:
      "Simply paste any text that contains invoice details — such as an email, a list of items, or unstructured data — and Novaflow automatically extracts, organizes, and formats the invoice information.",
  },
  {
    question: "Is my invoice data secure?",
    answer:
      "Yes. All data is processed securely on encrypted channels. Novaflow does not store or share your invoice content without your permission.",
  },
  {
    question: "Can I edit extracted invoice details?",
    answer:
      "Absolutely. After extraction, you can review and edit every field such as date, items, pricing, and client information before saving or exporting.",
  },
  {
    question: "Does Novaflow support multiple invoice formats?",
    answer:
      "Yes. Novaflow can understand structured, semi-structured, and unstructured invoice text from emails, PDFs, chats, or notes.",
  },
  {
    question: "Can I export invoices as PDF?",
    answer:
      "Yes. You can generate a clean, professional PDF invoice with a single click after reviewing and confirming the extracted details.",
  },
  {
    question: "Do I need an account to use Novaflow?",
    answer:
      "No. You can extract and preview invoice details without an account. However, creating an account enables saving history, syncing, and advanced features.",
  },
];

export const NAVIGATION_MENU: NavigationItem[] = [
  { id: "dashboard", name: "Dashboard", icon: LayoutDashboard },
  { id: "invoices", name: "Invoices", icon: FileText },
  { id: "invoices/new", name: "CreateInvoice", icon: Plus },
  { id: "profile", name: "Profile", icon: Users },
];

export const providers: ProvidersProps[] = [
  { value: "gemini", label: "Gemini", icon: Sparkles },
  { value: "openai", label: "OpenAI", icon: Cpu },
];
