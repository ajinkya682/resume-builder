import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToastProvider } from "@/providers/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ResumeAI — Build ATS-Optimized Resumes with AI",
    template: "%s | ResumeAI",
  },
  description:
    "Create professional, ATS-optimized resumes powered by AI. Generate summaries, skills, experience descriptions, and get real-time ATS scoring.",
  keywords: [
    "resume builder",
    "AI resume",
    "ATS score",
    "job application",
    "CV builder",
  ],
  authors: [{ name: "ResumeAI" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>
          <ToastProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
