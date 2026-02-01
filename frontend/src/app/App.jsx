import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../components/ui/toaster";
import { Toaster as Sonner } from "../components/ui/sonner";
import { TooltipProvider } from "../components/ui/tooltip";
import { SidebarProvider } from "../contexts/SidebarContext";
import { AuthProvider } from "../contexts/AuthContext";
import Router from "./Router";
import FullScreenLoader from "@/components/loaders/FullScreenLoader";

const queryClient = new QueryClient();

const App = () => {
  const [loading, setLoading] = useState(true);
  const [logoPhase, setLogoPhase] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setLogoPhase(1), 1500);
    const t2 = setTimeout(() => setLoading(false), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <SidebarProvider>
            <Toaster />
            <Sonner />

            {/* 🔥 FULL SCREEN LOADER */}
            {loading && <FullScreenLoader logoPhase={logoPhase} />}

            {/* 🌍 APP ROUTES */}
            {!loading && (
              <BrowserRouter>
                <Router />
              </BrowserRouter>
            )}
          </SidebarProvider>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
