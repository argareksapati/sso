export type AuthIdentity = {
  subject: string;
  displayName: string;
  roles: string[];
};

export type LoginCredentials = {
  identifier: string;
  password: string;
};

export interface AuthProvider {
  readonly kind: "mock" | "supabase" | "oidc";
  authenticate(credentials: LoginCredentials): Promise<AuthIdentity | null>;
  requestPasswordRecovery(identifier: string): Promise<void>;
}
