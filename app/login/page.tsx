"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Cookies from "js-cookie";


export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const ADMIN_EMAIL = "Nextlabs@gmail.com";
  const ADMIN_PASSWORD = "Nextlabs@2026";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        Cookies.set("adminAuth", "true", {
          expires: 1,
          sameSite: "strict",
        });
        router.push("/admin");
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="login-page min-h-screen flex items-center justify-center bg-[var(--color-bg-alt)] p-8 relative overflow-hidden font-sans">
      {/* Background Gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#6366f1] opacity-[0.05] rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-[#8b5cf6] opacity-[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[420px] bg-white p-12 rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] border border-[var(--color-border)] relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 100 100" fill="none">
                <path d="M50 25 L70 50 L50 75 L30 50 Z" fill="white" opacity="0.9"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-[#0f172a]">
              NextLake<span className="text-[#8b5cf6]">Labs</span>
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0f172a] mb-2">Admin Portal</h1>
          <p className="text-[var(--color-text-light)] text-sm">Sign in to manage your website content</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-500 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-[#0f172a]">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nextlakelabs.com"
              className="w-full px-4 py-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-alt)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[#6366f11a] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" title="Password" className="block text-sm font-semibold text-[#0f172a]">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg-alt)] focus:outline-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[#6366f11a] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-light)] hover:text-[var(--color-text)]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white font-bold rounded-full shadow-[0_4px_15px_rgba(99,102,241,0.35)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.45)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <a 
          href="/" 
          className="block text-center mt-8 text-sm text-[var(--color-text-light)] hover:text-[var(--color-primary)] transition-colors"
        >
          ← Back to main website
        </a>
      </div>
    </div>
  );
}
