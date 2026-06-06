"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, FileText, Eye, EyeOff, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsSubmitting(true);
    try {
      await login(form);
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      setErrors({ form: msg });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex">
      {/* Left panel — Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-[var(--surface)] border-r border-[var(--border)] flex-col justify-between p-12 overflow-hidden">
        {/* Gradient orb */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--primary), transparent)" }}
        />
        <div
          className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, var(--primary-light), transparent)" }}
        />

        {/* Logo */}
        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-[var(--shadow-primary)]">
            <FileText size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl text-[var(--text-primary)]">
            Resume<span className="text-[var(--primary-light)]">AI</span>
          </span>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] leading-tight">
            Land your dream job with an
            <span className="gradient-text"> AI-powered </span>
            resume.
          </h1>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
            Generate ATS-optimized summaries, skills, and descriptions — all powered by Gemini AI.
          </p>
          {/* Feature bullets */}
          {[
            "AI-generated resume content",
            "Real-time ATS score analysis",
            "Professional PDF export",
          ].map((f) => (
            <div key={f} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[var(--primary-glow)] border border-[var(--primary)]/30 flex items-center justify-center">
                <span className="text-[var(--primary-light)] text-xs">✓</span>
              </div>
              <span className="text-sm text-[var(--text-secondary)]">{f}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-[var(--text-muted)] relative z-10">
          © {new Date().getFullYear()} ResumeAI. All rights reserved.
        </p>
      </div>

      {/* Right panel — Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <FileText size={15} className="text-white" />
            </div>
            <span className="font-bold text-[var(--text-primary)]">
              Resume<span className="text-[var(--primary-light)]">AI</span>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-1.5">
              Welcome back
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Sign in to continue building your resume.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errors.form && (
              <div className="p-3 rounded-[10px] bg-[var(--error-bg)] border border-[var(--error)]/30 text-sm text-[var(--error)] fade-in">
                {errors.form}
              </div>
            )}

            <Input
              id="login-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              error={errors.email}
              leftIcon={<Mail size={16} />}
              autoComplete="email"
              required
            />

            <Input
              id="login-password"
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              error={errors.password}
              leftIcon={<Lock size={16} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPass((p) => !p)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] cursor-pointer"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isSubmitting}
              rightIcon={<ArrowRight size={18} />}
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[var(--primary-light)] hover:text-[var(--primary)] font-medium transition-colors"
            >
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
