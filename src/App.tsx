// src/App.tsx
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import RequireAuth from "@/components/RequireAuth";
import { AppLayout } from "@/components/layout/AppLayout";

import Index from "./Pages/Index";
import HR from "./Pages/HR";
import Policies from "./Pages/Policies";
import FAQs from "./Pages/FAQs";
import LearningDevelopment from "./Pages/LearningDevelopment";
import Products from "./Pages/Products";
import EmployeeEngagement from "./Pages/EmployeeEngagement";
import InternalJobs from "./Pages/InternalJobs";
import Talentacquisition from "./Pages/Talentacquisition";
import Holidays from "./Pages/Holidays";
import NotFound from "./Pages/NotFound";
import OrgStructure from "./Pages/orgstructure";
import Performance from "./Pages/Performance";
import MySkills from "./Pages/MySkills";
import MyCertifications from "./Pages/MyCertifications";
import AdminDashboard from "./Pages/AdminDashboard";
import MyCourses from "./Pages/MyCourses";

const queryClient = new QueryClient();

export default function App() {
  console.log("App rendered");
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* If someone hits /login (old bookmark), send them to home */}
            <Route path="/login" element={<Navigate to="/" replace />} />

            {/* Everything below requires MSAL SSO */}
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route index element={<Index />} />
                <Route path="/home" element={<Index />} />
                <Route path="/hr" element={<HR />} />
                <Route path="/policies" element={<Policies />} />
                <Route path="/holidays" element={<Holidays />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="/learning" element={<LearningDevelopment />} />
                <Route path="/my-courses" element={<MyCourses />} />
                <Route path="/products" element={<Products />} />
                <Route path="/engagement" element={<EmployeeEngagement />} />
                <Route path="/jobs" element={<InternalJobs />} />
                <Route path="/talent" element={<Talentacquisition />} />
                <Route path="/org" element={<OrgStructure />} />
                <Route path="/performance" element={<Performance />} />
                <Route path="/my-skills" element={<MySkills />} />
                <Route path="/my-certifications" element={<MyCertifications />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Route>

            {/* Catch-all → home (avoid 404 while removing the login page) */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
