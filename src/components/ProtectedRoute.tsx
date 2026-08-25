// components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('🔒 ProtectedRoute:', { 
    loading, 
    user, 
    adminOnly, 
    role: user?.role,
    path: location.pathname 
  });

  // ✅ Check for cross-domain auth in URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#auth=')) {
      try {
        const authData = JSON.parse(atob(hash.replace('#auth=', '')));
        console.log('✅ ProtectedRoute: Cross-domain auth detected');
        
        // ✅ Store in localStorage
        localStorage.setItem('auth_token', authData.token);
        localStorage.setItem('auth_user', JSON.stringify(authData.user));
        
        // ✅ Remove hash from URL
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        
        // ✅ Reload to apply auth
        window.location.reload();
        return;
      } catch (error) {
        console.error('❌ ProtectedRoute hash auth error:', error);
      }
    }
  }, []);

  // ✅ Check for cross-domain auth in sessionStorage
  useEffect(() => {
    const authData = sessionStorage.getItem('cross_domain_auth');
    if (authData) {
      try {
        const { token, user: userData } = JSON.parse(authData);
        console.log('✅ ProtectedRoute: Cross-domain auth from sessionStorage');
        
        // ✅ Store in localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(userData));
        
        // ✅ Clear sessionStorage
        sessionStorage.removeItem('cross_domain_auth');
        
        // ✅ Reload to apply auth
        window.location.reload();
        return;
      } catch (error) {
        console.error('❌ ProtectedRoute sessionStorage auth error:', error);
        sessionStorage.removeItem('cross_domain_auth');
      }
    }
  }, []);

  // ✅ Wait for auth to load
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  // ✅ Redirect to auth if not logged in
  if (!user) {
    console.log('❌ No user, redirecting to auth');
    
    // ✅ Store the attempted path for redirect after login
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    
    // ✅ If on subdomain, go to login subdomain
    if (window.location.hostname.includes('login.')) {
      return <Navigate to={`/auth?returnUrl=${returnUrl}`} replace />;
    }
    
    // ✅ If on main domain, go to login subdomain
    window.location.href = `https://login.ntygear.com/auth?returnUrl=${returnUrl}`;
    return null;
  }

  // ✅ Check admin role
  if (adminOnly) {
    if (user.role !== 'admin') {
      console.log('❌ Not admin, redirecting to account');
      toast.error('You do not have admin access.');
      
      // ✅ If on subdomain, redirect to main domain account
      if (window.location.hostname.includes('login.')) {
        window.location.href = 'https://ntygear.com/account';
        return null;
      }
      
      return <Navigate to="/account" replace />;
    }
  }

  console.log('✅ Access granted to:', user.role);
  return <>{children}</>;
}