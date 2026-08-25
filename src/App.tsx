// App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import SupportTab from "./components/SupportTab.tsx";
import { RefTracker } from "./components/RefTracker.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

// Lazy-loaded routes
const Shop = lazy(() => import("./pages/Shop.tsx"));
const Product = lazy(() => import("./pages/Product.tsx"));
const Story = lazy(() => import("./pages/Story.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const Partners = lazy(() => import("./pages/Partners.tsx"));
const BenchClub = lazy(() => import("./pages/BenchClub.tsx"));
const BenchClubShop = lazy(() => import("./pages/BenchClubShop.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const Account = lazy(() => import("./pages/Account.tsx"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe.tsx"));
const NattyVerified = lazy(() => import("./pages/NattyVerified.tsx"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
};

// ✅ ONLY ONE Cross-Domain Auth Handler (Remove from ProtectedRoute)
const CrossDomainAuthHandler = () => {
  useEffect(() => {
    // ✅ Check for auth in URL hash (from login.ntygear.com)
    const hash = window.location.hash;
    if (hash && hash.startsWith('#auth=')) {
      try {
        const authData = JSON.parse(atob(hash.replace('#auth=', '')));
        console.log('✅ Cross-domain auth detected from URL hash');

        // ✅ Store in localStorage
        localStorage.setItem('auth_token', authData.token);
        localStorage.setItem('auth_user', JSON.stringify(authData.user));

        // ✅ Remove hash from URL
        window.history.replaceState(null, '', window.location.pathname + window.location.search);

        // ✅ ONLY reload if user not already set
        if (!localStorage.getItem('auth_user')) {
          window.location.reload();
        }
        return;
      } catch (error) {
        console.error('❌ Hash auth error:', error);
      }
    }
  }, []);

  return null;
};

const RouteFallback = () => (
  <div className="min-h-screen bg-background flex items-center justify-center text-xs tracking-widest uppercase text-muted-foreground">
    Loading…
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <CrossDomainAuthHandler />
          <ScrollToTop />
          <RefTracker />
          <SupportTab />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<Product />} />
              <Route path="/story" element={<Story />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/partners" element={<Partners />} />
              <Route path="/bench-club" element={<BenchClub />} />
              <Route path="/bench-club-shop" element={<BenchClubShop />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/natty-verification" element={<NattyVerified />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;