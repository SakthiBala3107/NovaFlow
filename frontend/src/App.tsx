import { Toaster } from "react-hot-toast"
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import LandingPage from "./Pages/LandingPage/LandingPage"
import SignUp from "./Pages/Auth/SignUp"
import Login from "./Pages/Auth/Login"
import Dashboard from "./Pages/Dashboard/Dashboard"
import Allinvoices from "./Pages/Invoices/Allinvoices"
import CreateInvoice from "./Pages/Invoices/CreateInvoice"
import InvoiceDetail from "./Pages/Invoices/InvoiceDetail"
import ProfilePage from "./Pages/Profile/ProfilePage"
import ProtectedRoute from "./components/Auth/Procted.Route"
// import {AuthProvider} from './context/AuthContext.jsx'

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes (authenticated ones)*/}
          <Route path="/" element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="invoices" element={<Allinvoices />} />
            <Route path="invoices/new" element={<CreateInvoice />} />
            <Route path="invoices/:id" element={<InvoiceDetail />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>


          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </Router>

      {/* Toaster*/}
      <Toaster toastOptions={{
        className: "", style: { fontSize: "13px" }
      }} />
    </div>
  )
}

export default App