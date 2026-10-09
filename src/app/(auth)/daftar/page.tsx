import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AuthFrame } from "@/components/auth/auth-frame";
import { RegisterForm } from "@/components/auth/register-form";
import { getSession } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Daftar" };

export default async function RegisterPage() {
  if (await getSession()) redirect("/portal");
  return <AuthFrame><RegisterForm /></AuthFrame>;
}
