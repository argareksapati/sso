import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { AuthIdentity } from "./contracts";
import { getAppOrigin, getSupabasePublicConfig } from "./supabase-config";
import { mapSupabaseIdentity } from "./supabase-identity";

export type RegistrationInput = {
  fullName: string;
  email: string;
  password: string;
};

export type RegistrationResult =
  | { status: "signed_in"; identity: AuthIdentity }
  | { status: "confirmation_required" };

export class RegistrationError extends Error {
  constructor(public readonly code: "invalid_email" | "weak_password" | "rate_limited" | "email_delivery_unavailable" | "unavailable") {
    super(code);
  }
}

function confirmationRedirect() {
  return new URL("/login?registered=confirmed", getAppOrigin()).toString();
}

export async function registerSupabaseAccount(input: RegistrationInput): Promise<RegistrationResult> {
  const config = getSupabasePublicConfig();
  const client = createClient(config.url, config.publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  const { data, error } = await client.auth.signUp({
    email: input.email.trim().toLocaleLowerCase("id-ID"),
    password: input.password,
    options: {
      data: { full_name: input.fullName.trim() },
      emailRedirectTo: confirmationRedirect(),
    },
  });

  if (error) {
    if (error.code === "user_already_exists") return { status: "confirmation_required" };
    if (error.code === "email_address_invalid") throw new RegistrationError("invalid_email");
    if (error.code === "weak_password") throw new RegistrationError("weak_password");
    if (error.code === "over_email_send_rate_limit") throw new RegistrationError("rate_limited");
    if (error.code === "email_address_not_authorized") throw new RegistrationError("email_delivery_unavailable");
    throw new RegistrationError("unavailable");
  }

  if (data.session && data.user) {
    return { status: "signed_in", identity: mapSupabaseIdentity(data.user) };
  }

  return { status: "confirmation_required" };
}
