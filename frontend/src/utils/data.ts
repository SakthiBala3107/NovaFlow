import {
  Sparkles,
  BarChart2,
  Mail,
  FileText,
  type LucideIcon,
} from "lucide-react";

export type Feature = {
  icon?: LucideIcon;
  title: string;
  description: string;
};

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

export type Testimonial = {
  quote: string;
  author: string;
  title: string;
  avatar: string;
};

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
