import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

import type { AppSession } from "./session";
import { getSupabasePublicConfig } from "./supabase-config";

export type PasswordChangeCode = "invalid_current" | "weak_password" | "unsupported" | "unavailable";

export class PasswordChangeError extends Error {
  constructor(public readonly code: PasswordChangeCode) {
    super(code);
  }
}

type PasswordChangeInput = {
  session: AppSession;
  identifier: string;
  currentPassword: string;
  newPassword: string;
};

function digest(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

function equalSecret(left: string, right: string) {
  return timingSafeEqual(digest(left), digest(right));
}

async function changeMockPassword(input: PasswordChangeInput) {
  const expectedIdentifier = process.env.AUTH_MOCK_IDENTIFIER;
  const expectedPassword = process.env.AUTH_MOCK_PASSWORD;
  if (!expectedIdentifier || !expectedPassword) throw new PasswordChangeError("unavailable");
  if (
    !equalSecret(input.identifier.trim().toLocaleLowerCase("id-ID"), expectedIdentifier.trim().toLocaleLowerCase("id-ID")) ||
    !equalSecret(input.currentPassword, expectedPassword)
  ) {
    throw new PasswordChangeError("invalid_current");
  }
}

async function changeSupabasePassword(input: PasswordChangeInput) {
  const config = getSupabasePublicConfig();
  const client = createClient(config.url, config.publishableKey, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
  });
  const email = input.identifier.trim().toLocaleLowerCase("id-ID");
  const { data, error: signInError } = await client.auth.signInWithPassword({
    email,
    password: input.currentPassword,
  });
  if (signInError || !data.user || `supabase:${data.user.id}` !== input.session.subject) {
    throw new PasswordChangeError("invalid_current");
  }

  const { error } = await client.auth.updateUser({ password: input.newPassword });
  if (!error) return;
  if (error.code === "weak_password" || error.code === "same_password") {
    throw new PasswordChangeError("weak_password");
  }
  throw new PasswordChangeError("unavailable");
}

export async function changePassword(input: PasswordChangeInput) {
  const provider = process.env.AUTH_PROVIDER;
  if (provider === "mock") return changeMockPassword(input);
  if (provider === "supabase") return changeSupabasePassword(input);
  throw new PasswordChangeError("unsupported");
}
