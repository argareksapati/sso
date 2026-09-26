import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthFrame } from "@/components/auth/auth-frame";
import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Masuk" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  if (await getSession()) redirect("/portal");
  const { returnTo } = await searchParams;
  return <AuthFrame><LoginForm returnTo={returnTo} /></AuthFrame>;
}
