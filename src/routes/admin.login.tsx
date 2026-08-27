import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Mail, Lock, EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { getAuthorizedSession, getUserProfile } from "@/lib/api/auth";
import { supabase } from "@/lib/supabase/client";

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search) => ({
    reason: typeof search.reason === "string" ? search.reason : undefined,
  }),
  beforeLoad: async () => {
    const access = await getAuthorizedSession();
    if (access.authorized) {
      throw redirect({ to: "/admin/issues" });
    }
  },
  component: AdminLoginComponent,
});

function AdminLoginComponent() {
  const navigate = useNavigate();
  const { reason } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    reason === "unauthorized" ? "Please sign in with an authorized admin account." : null,
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMessage(error.message);
      setSubmitting(false);
      return;
    }

    try {
      const profile = data.user ? await getUserProfile(data.user.id) : null;
      if (!profile || !["ADMIN", "STAFF", "DEPT_MANAGER"].includes(profile.role)) {
        await supabase.auth.signOut();
        setErrorMessage("Access denied. This account does not have administrator permissions.");
        setSubmitting(false);
        return;
      }

      await navigate({ to: "/admin/issues" });
    } catch (error) {
      await supabase.auth.signOut();
      setErrorMessage(error instanceof Error ? error.message : "Unable to sign in right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center p-4">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10 relative overflow-hidden">
        
        {/* Header Icon */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-red-500" />
          </div>
          <span className="bg-red-50 text-red-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
            Administrator Access Only
          </span>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-center text-gray-500 text-sm">
            Please enter your secure credentials to manage<br/>the campus transparency dashboard.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Institutional Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3019] focus:border-transparent transition-all"
                placeholder="admin@campus.edu"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-10 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0A3019] focus:border-transparent transition-all tracking-widest"
                placeholder="••••••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {errorMessage ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded text-[#0A3019] focus:ring-[#0A3019] border-gray-300 accent-[#0A3019]" defaultChecked />
              <span className="text-sm font-medium text-gray-700">Remember me</span>
            </label>
            <a href="#" className="text-sm font-bold text-[#0A3019] hover:underline">Forgot Password?</a>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-[#0A3019] text-white font-semibold rounded-xl py-3.5 hover:bg-[#082613] transition-colors mt-4"
          >
            {submitting ? "Signing in..." : "Sign in to Admin Dashboard"}
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="mt-8 flex items-start gap-3 max-w-sm">
        <ShieldCheck className="w-5 h-5 text-gray-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-gray-900">Secure Administrator Access</h4>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            This system logs and audits all activities. Unauthorized entries will be reported.
          </p>
        </div>
      </div>

    </div>
  );
}
