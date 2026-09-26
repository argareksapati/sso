import type { Metadata } from "next";

import { AuthFrame } from "@/components/auth/auth-frame";
import { RecoveryForm } from "@/components/auth/recovery-form";

export const metadata: Metadata = { title: "Lupa kata sandi" };

export default function ForgotPasswordPage() {
  return <AuthFrame compact><RecoveryForm /></AuthFrame>;
}
