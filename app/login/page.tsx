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
    <div className="min-h-screen flex flex-col">
      {/* 🔥 DARK STRIP FOR NAVBAR VISIBILITY */}
      <div className="relative bg-[var(--primary-bg)]">

        <div className="h-32 md:h-36" />
      </div>

      {/* 🔥 LIGHT LOGIN AREA */}
      <main className="flex-grow flex items-center justify-center px-4 py-20 bg-gradient-to-br from-[#f1f7f6] via-white to-[#eef3ff]">
        <div className="relative w-full max-w-md">

          {/* Soft Glow */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#64bab4] to-[#155DFC] blur-2xl opacity-25 -z-10" />

          {/* Card */}
          <div className="relative bg-white/90 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-2xl p-10 md:p-15  ">
            <div className="text-center mb-15">
              <h1 className="text-3xl font-bold text-gray-900">
                NextLakeLabs Admin
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Secure access to the admin dashboard
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@domain.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#64bab4]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#64bab4]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2 text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#64bab4] to-[#155DFC] text-white font-semibold shadow-lg hover:opacity-95 transition disabled:opacity-70 mt-6"
              >
                {loading ? "Authenticating..." : "Login to Dashboard"}
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-6">
              © {new Date().getFullYear()} Admin Panel • Authorized Access Only
            </p>
          </div>
        </div>
      </main>

    </div>
  );
}
