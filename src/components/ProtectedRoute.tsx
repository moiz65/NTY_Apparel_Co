// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { toast } from './ui/use-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  console.log('🔒 ProtectedRoute:', { loading, user, adminOnly, role: user?.role });

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
    return <Navigate to="/auth" replace />;
  }

  // ✅ Check admin role
  if (adminOnly) {
    if (user.role !== 'admin') {
      console.log('❌ Not admin, redirecting to account');
      toast({
        title: 'Access denied',
        description: 'You do not have admin access.',
        variant: 'destructive',
      });
      return <Navigate to="/account" replace />;
    }
  }

  console.log('✅ Access granted');
  return <>{children}</>;
}