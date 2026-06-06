import { redirect } from "next/navigation";

/**
 * Root "/" redirects to /dashboard.
 * The dashboard layout handles auth guard and redirects to /login if needed.
 */
export default function HomePage() {
  redirect("/dashboard");
}
