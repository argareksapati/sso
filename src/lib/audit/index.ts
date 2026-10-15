import "server-only";

export type AuditEventType =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILURE"
  | "LOGIN_CHALLENGE_FAILURE"
  | "LOGIN_GOOGLE_SUCCESS"
  | "LOGIN_GOOGLE_FAILURE"
  | "LOGIN_RATE_LIMITED"
  | "REGISTER_SUCCESS"
  | "REGISTER_CONFIRMATION_REQUIRED"
  | "REGISTER_FAILURE"
  | "REGISTER_RATE_LIMITED"
  | "LOGOUT"
  | "PROFILE_UPDATED"
  | "PROFILE_PHOTO_UPDATED"
  | "PROFILE_PHOTO_DELETED"
  | "PASSWORD_CHANGED"
  | "PASSWORD_CHANGE_FAILURE"
  | "PASSWORD_CHANGE_RATE_LIMITED"
  | "CONNECTED_APP_REVOKED"
  | "RECOVERY_REQUESTED";

export async function recordAuditEvent(type: AuditEventType) {
  if (process.env.NODE_ENV === "development") {
    console.info(JSON.stringify({ source: "sso-portal", type, at: new Date().toISOString() }));
  }
  // TODO: connect an approved append-only audit sink. Never include passwords or full tokens.
}
