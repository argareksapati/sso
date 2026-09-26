import "server-only";

export type AuditEventType =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILURE"
  | "LOGIN_RATE_LIMITED"
  | "LOGOUT"
  | "RECOVERY_REQUESTED";

export async function recordAuditEvent(type: AuditEventType) {
  if (process.env.NODE_ENV === "development") {
    console.info(JSON.stringify({ source: "sso-portal", type, at: new Date().toISOString() }));
  }
  // TODO: connect an approved append-only audit sink. Never include passwords or full tokens.
}
