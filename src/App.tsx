import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { PropertiesManagement } from "@/pages/admin/PropertiesManagement";
import { VisitorsAnalytics } from "@/pages/admin/VisitorsAnalytics";
import { PropertyViews } from "@/pages/admin/PropertyViews";
import { RatingsManagement } from "@/pages/admin/RatingsManagement";
import { AdminSettings } from "@/pages/admin/AdminSettings";
import AdvertisementManagement from "@/pages/admin/AdvertisementManagement";
import Auth from "@/pages/Auth";
import AdminAuth from "@/pages/AdminAuth";
import { useVisitorTracking } from "@/hooks/useVisitorTracking";

// Frontend Pages
import Home from "@/pages/frontend/Home";
import Properties from "@/pages/frontend/Properties";
import Villas from "@/pages/frontend/Villas";
import Apartments from "@/pages/frontend/Apartments";
import Studios from "@/pages/frontend/Studios";
import Houses from "@/pages/frontend/Houses";

const queryClient = new QueryClient();

const RouteChangeTracker = () => {
  const location = useLocation();
  useVisitorTracking(`${location.pathname}${location.search}`);
  return null;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <RouteChangeTracker />
          <Routes>
            {/* Frontend Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/villas" element={<Villas />} />
            <Route path="/properties/apartments" element={<Apartments />} />
            <Route path="/properties/studios" element={<Studios />} />
            <Route path="/properties/houses" element={<Houses />} />
            
            {/* Auth Routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/auth" element={<AdminAuth />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="properties" element={<PropertiesManagement />} />
              <Route path="advertisements" element={<AdvertisementManagement />} />
              <Route path="visitors" element={<VisitorsAnalytics />} />
              <Route path="views" element={<PropertyViews />} />
              <Route path="ratings" element={<RatingsManagement />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
