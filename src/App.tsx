import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { PropertiesManagement } from "@/pages/admin/PropertiesManagement";
import { VisitorsAnalytics } from "@/pages/admin/VisitorsAnalytics";
import { PropertyViews } from "@/pages/admin/PropertyViews";
import { RatingsManagement } from "@/pages/admin/RatingsManagement";
import { AdminSettings } from "@/pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="properties" element={<PropertiesManagement />} />
            <Route path="visitors" element={<VisitorsAnalytics />} />
            <Route path="views" element={<PropertyViews />} />
            <Route path="ratings" element={<RatingsManagement />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
