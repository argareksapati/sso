import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { AuthIdentity, AuthProvider, LoginCredentials } from "./contracts";
import { mapSupabaseIdentity } from "./supabase-identity";

function requireConfig(name: "SUPABASE_URL" | "SUPABASE_PUBLISHABLE_KEY") {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} belum dikonfigurasi.`);
  return value;
}

function recoveryRedirect() {
  const configured = process.env.SUPABASE_PASSWORD_RESET_REDIRECT?.trim();
  if (configured) return configured;
  const origin = process.env.APP_ORIGIN?.trim();
  if (!origin) throw new Error("APP_ORIGIN belum dikonfigurasi.");
  return new URL("/reset-kata-sandi", origin).toString();
}

export class SupabaseAuthProvider implements AuthProvider {
  readonly kind = "supabase" as const;
  private readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(
      requireConfig("SUPABASE_URL"),
      requireConfig("SUPABASE_PUBLISHABLE_KEY"),
      {
        auth: {
          autoRefreshToken: false,
          detectSessionInUrl: false,
          persistSession: false,
        },
      },
    );
  }

  async authenticate(credentials: LoginCredentials): Promise<AuthIdentity | null> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email: credentials.identifier.trim(),
      password: credentials.password,
    });

    if (error) {
      if (error.status === 400 || error.status === 401) return null;
      throw new Error("Supabase Auth tidak tersedia.");
    }
    if (!data.user) return null;
    return mapSupabaseIdentity(data.user);
  }

  async requestPasswordRecovery(identifier: string): Promise<void> {
    const { error } = await this.client.auth.resetPasswordForEmail(identifier.trim(), {
      redirectTo: recoveryRedirect(),
    });
    if (error) throw new Error("Pemulihan Supabase Auth tidak tersedia.");
  }
}

