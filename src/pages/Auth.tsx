// pages/Auth.tsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import Header from "@/components/Header";

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // ✅ Redirect if already logged in
  useEffect(() => {
    console.log('🔍 Auth useEffect:', { 
      authLoading, 
      user, 
      redirecting, 
      role: user?.role,
      userExists: !!user 
    });
    
    if (authLoading) {
      console.log('⏳ Auth is loading...');
      return;
    }
    
    if (user && !redirecting) {
      setRedirecting(true);
      let destination = '/account';
      
      // ✅ Check role properly
      if (user.role === 'admin') {
        destination = '/admin';
      } else if (user.role === 'customer') {
        destination = '/account';
      } else {
        // ❌ If role is undefined or something else, default to account
        console.warn('⚠️ Unknown role:', user.role, 'defaulting to /account');
        destination = '/account';
      }
      
      console.log(`✅ Redirecting to: ${destination} (role: ${user.role})`);
      
      // ✅ Use setTimeout to ensure state updates
      setTimeout(() => {
        navigate(destination, { replace: true });
      }, 100);
    }
  }, [user, authLoading, navigate, redirecting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || authLoading) return;

    setLoading(true);
    try {
      if (mode === "signup") {
        await signUp(name, email, password);
      } else {
        await signIn(email, password);
      }
      // After successful login, useEffect will handle redirect
      console.log('✅ Form submitted successfully');
    } catch (error) {
      console.error('❌ Form error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  // ✅ If user already exists but redirecting, show loading
  if (redirecting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-3xl tracking-widest mb-2" style={{ fontFamily: "'Arial Black', sans-serif" }}>
          {mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}
        </h1>
        <p className="text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          {mode === "login" ? "Access your rewards & orders" : "Join the NTY community"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
              className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className="w-full bg-transparent border border-border px-4 py-3 text-sm focus:outline-none focus:border-foreground"
          />
          <button
            type="submit"
            disabled={loading || authLoading}
            className="w-full bg-foreground text-background py-3 text-sm tracking-[0.2em] uppercase hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-6 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition"
          disabled={loading}
        >
          {mode === "login" ? "New here? Create account" : "Have an account? Sign in"}
        </button>

        <div className="mt-8">
          <Link to="/" className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground">
            ← Back to site
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Auth;