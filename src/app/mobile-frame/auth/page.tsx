"use client";

import { useState } from "react";
import { MobileFrame } from "@/components/ui/mobileframe";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  Apple,
  Facebook,
} from "lucide-react";

export default function AuthMobileFrame() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `${isLogin ? "Logging in" : "Signing up"} with email: ${formData.email}`
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-emerald-50 p-4 md:p-8 flex items-center justify-center">
      <MobileFrame showHeader={false}>
        {/* Logo and Welcome */}
        <div className="pt-8 px-6 text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-linear-to-br from-blue-600 to-emerald-600 mb-4">
            <span className="text-2xl font-black text-white">L</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isLogin ? "Welcome Back" : "Join LoopLebanon"}
          </h1>
          <p className="text-slate-600 mt-2">
            {isLogin
              ? "Sign in to continue sharing with your community"
              : "Create an account to start trading and sharing"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  placeholder="+961 XX XXX XXX"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={18} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 pr-12 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                className="text-blue-600 text-sm font-medium"
                aria-label="Forgot password"
                title="Forgot password"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-linear-to-r from-blue-600 to-emerald-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>

          {isLogin && (
            <div className="text-center">
                <p className="text-slate-600 text-sm">
                Do not have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-blue-600 font-medium"
                  aria-label="Sign up"
                  title="Sign up"
                >
                  Sign up
                </button>
              </p>
            </div>
          )}

          {!isLogin && (
            <div className="text-center">
              <p className="text-slate-600 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-blue-600 font-medium"
                  aria-label="Sign in"
                  title="Sign in"
                >
                  Sign in
                </button>
              </p>
            </div>
          )}
        </form>

        {/* Divider */}
        <div className="px-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                Or continue with
              </span>
            </div>
          </div>
        </div>

        {/* Social Login */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-3 gap-3">
            <button
              className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Continue with Google"
              title="Continue with Google"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </button>
            <button
              className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Continue with Apple"
              title="Continue with Apple"
            >
              <Apple size={20} />
            </button>
            <button
              className="flex items-center justify-center gap-2 py-3 bg-white border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
              aria-label="Continue with Facebook"
              title="Continue with Facebook"
            >
              <Facebook size={20} className="text-blue-600" />
            </button>
          </div>
        </div>

        {/* Terms */}
        <div className="px-6 py-4">
          <p className="text-xs text-slate-500 text-center">
            By continuing, you agree to our{" "}
            <button
              className="text-blue-600"
              aria-label="View Terms"
              title="View Terms"
            >
              Terms
            </button>{" "}
            and{" "}
            <button
              className="text-blue-600"
              aria-label="View Privacy Policy"
              title="View Privacy Policy"
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </MobileFrame>
    </div>
  );
}
