
import * as React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SubscriptionProvider } from "./contexts/SubscriptionContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Subscription from "./pages/Subscription";
import NotFound from "./pages/NotFound";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import AboutUs from "./pages/AboutUs";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <SubscriptionProvider>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Index />} />
                  <Route 
                    path="/subscription" 
                    element={
                      <ProtectedRoute>
                        <Subscription />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/blog" 
                    element={<Blog />} 
                  />
                  <Route 
                    path="/blog/:slug" 
                    element={<BlogPost />} 
                  />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SubscriptionProvider>
            </AuthProvider>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
