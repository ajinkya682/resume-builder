"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Phone,
  FileText,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function RegisterPage() {
  const { register, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.mobile && form.mobile.replace(/\D/g, "").length !== 10)
      e.mobile = "Must be 10 digits";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setIsSubmitting(true);
    try {
      await register(form);
      router.push("/dashboard");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setErrors({ form: msg });
    } finally {
      setIsSubmitting(false);
    }
  }

  const field = (key: keyof typeof form, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  if (isLoading) return null;

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-1/2 relative bg-[var(--surface)] border-r border-[var(--border)] flex-col justify-between p-12 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, var(--primary), transparent)" }} />

        <div className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-[var(--shadow-primary)]">
            <FileText size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl text-[var(--text-primary)]">
            Resume<span className="text-[var(--primary-light)]">AI</span>
          </span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] leading-tight">
            Your career journey
            <br />
            <span className="gradient-text">starts here.</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
            Join thousands of professionals who built their dream resumes with ResumeAI.
          </p>
          <div className="bg-[var(--surface-2)] border border-[var(--border)] rounded-[14px] p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-[var(--primary-light)]" />
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                What you get — Free
              </span>
            </div>
            {[
              "AI-powered content generation",
              "ATS optimization scoring",
              "Unlimited resume edits",
              "Professional PDF export",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5 py-1.5 border-b border-[var(--border)] last:border-0">
                <span className="text-[var(--success)] text-xs">✓</span>
                <span className="text-sm text-[var(--text-secondary)]">{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-[var(--text-muted)] relative z-10">
          © {new Date().getFullYear()} ResumeAI. All rights reserved.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[420px]">
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
              Create your account
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Get started for free. No credit card required.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {errors.form && (
              <div className="p-3 rounded-[10px] bg-[var(--error-bg)] border border-[var(--error)]/30 text-sm text-[var(--error)] fade-in">
                {errors.form}
              </div>
            )}

            <Input
              id="register-name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => field("name", e.target.value)}
              error={errors.name}
              leftIcon={<User size={16} />}
              autoComplete="name"
              required
            />

            <Input
              id="register-email"
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => field("email", e.target.value)}
              error={errors.email}
              leftIcon={<Mail size={16} />}
              autoComplete="email"
              required
            />

            <Input
              id="register-mobile"
              label="Mobile Number"
              type="tel"
              placeholder="10-digit number"
              value={form.mobile}
              onChange={(e) => field("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
              error={errors.mobile}
              leftIcon={<Phone size={16} />}
              hint="Optional — 10 digits"
              autoComplete="tel"
            />

            <Input
              id="register-password"
              label="Password"
              type={showPass ? "text" : "password"}
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={(e) => field("password", e.target.value)}
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
              autoComplete="new-password"
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
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-[var(--text-secondary)] mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[var(--primary-light)] hover:text-[var(--primary)] font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
