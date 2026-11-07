import type { Metadata } from "next";
import { AuthFrame } from "@/components/auth/auth-frame";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = { title: "Reset kata sandi" };

export default function ResetPasswordPage() {
  return (
    <AuthFrame compact>
      <ResetPasswordForm />
    </AuthFrame>
  );
}
