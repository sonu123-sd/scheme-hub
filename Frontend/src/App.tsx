import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import TotalSchemes from "./pages/TotalSchemes";
import CentralSchemes from "./pages/CentralSchemes";
import StateSchemes from "./pages/StateSchemes";
import CategoryView from "./pages/CategoryView";
import Eligibility from "./pages/Eligibility";
import SchemeDetail from "./pages/SchemeDetail";
import Dashboard from "./pages/Dashboard";
import AccountSettings from "./pages/AccountSettings";
import About from "./pages/About";
import Accessibility from "./pages/Accessibility";
import Disclaimer from "./pages/Disclaimer";
import TermsAndConditions from "./pages/TermsAndConditions";
import FAQ from "./pages/FAQ";
import Chatbot from "./components/Chatbot";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop"; 
import ProtectedRoute from "@/routes/ProtectedRoute";
import ContactUs from "./pages/ContactUs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop /> {/*  ADDED */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/total-schemes" element={<TotalSchemes />} />
            <Route path="/central-schemes" element={<CentralSchemes />} />
            <Route path="/state-schemes/:stateName?" element={<StateSchemes />} />
            <Route path="/category/:category" element={<CategoryView />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/settings" element={<AccountSettings />} />
            <Route path="/eligibility" element={<ProtectedRoute><Eligibility /></ProtectedRoute>} />
            <Route path="/scheme/:id" element={<ProtectedRoute><SchemeDetail /></ProtectedRoute>}/>
            <Route path="/about" element={<About />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Chatbot />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
