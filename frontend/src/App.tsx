import { Toaster } from "react-hot-toast";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import LandingPage from "./Pages/LandingPage/LandingPage";
import SignUp from "./Pages/Auth/SignUp";
import Login from "./Pages/Auth/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Allinvoices from "./Pages/Invoices/Allinvoices";
import CreateInvoice from "./Pages/Invoices/CreateInvoice";
import InvoiceDetail from "./Pages/Invoices/InvoiceDetail";
import ProfilePage from "./Pages/Profile/ProfilePage";

import ProtectedRoute from "./components/Auth/Procted.Route";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "./hooks/Authprovder";

const queryClient = new QueryClient();

const App = () => {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/invoices" element={<Allinvoices />} />
              <Route path="/invoices/new" element={<CreateInvoice />} />
              <Route path="/invoices/:id" element={<InvoiceDetail />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Toaster
            toastOptions={{
              className: "",
              style: { fontSize: "13px" },
            }}
          />
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
