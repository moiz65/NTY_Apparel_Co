// components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // ✅ Check cross-domain auth only once
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#auth=')) {
      try {
        const authData = JSON.parse(atob(hash.replace('#auth=', '')));
        localStorage.setItem('auth_token', authData.token);
        localStorage.setItem('auth_user', JSON.stringify(authData.user));
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        window.location.reload();
        return;
      } catch (error) {
        console.error('Hash auth error:', error);
      }
    }
    setIsChecking(false);
  }, []);

  if (isChecking || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ No user, redirecting to auth');
    const returnUrl = encodeURIComponent(location.pathname + location.search);
    
    if (window.location.hostname.includes('login.')) {
      return <Navigate to={`/auth?returnUrl=${returnUrl}`} replace />;
    }
    
    window.location.href = `https://login.ntygear.com/auth?returnUrl=${returnUrl}`;
    return null;
  }

  if (adminOnly && user.role !== 'admin') {
    console.log('❌ Not admin, redirecting to account');
    toast.error('You do not have admin access.');
    
    if (window.location.hostname.includes('login.')) {
      window.location.href = 'https://ntygear.com/account';
      return null;
    }
    
    return <Navigate to="/account" replace />;
  }

  console.log('✅ Access granted to:', user.role);
  return <>{children}</>;
}