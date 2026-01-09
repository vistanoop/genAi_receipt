import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";

import Landing from "./pages/landing-page";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/dashboard-page";
import Analyze from "./pages/analyze-page";
import LanguageSettings from "./pages/language-settings";
import Evidence from "./pages/evidence-page";
import Settings from "./pages/settings-page";
import Results from "./pages/result-page";
import IntelligenceHub from "./pages/intelligence-hub";
import IntelligenceReport from "./pages/intelligence-report";
import NotFound from "./pages/not-found";
import ChatPage from "./pages/chat-page";
import FraudDetection from "./pages/fraud-detection";

import { LanguageProvider } from "./contexts/LanguageContext";
import ErrorBoundary from "./components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route path="/intelligence-hub" element={<IntelligenceHub />} />
              <Route path="/intelligence-hub/report/:id" element={<IntelligenceReport />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/analyze" element={<Analyze />} />
              <Route path="/fraud-detection" element={<FraudDetection />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/results/:id" element={<Results />} />
              <Route path="/evidence" element={<Evidence />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/settings/language" element={<LanguageSettings />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;