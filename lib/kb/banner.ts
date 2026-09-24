// Dismissal of the "Before you request" banner is kept in a cookie so the server can
// skip rendering it (no flash). Move to a per-user preference once there is a user API.
export const BANNER_COOKIE = "kb_banner_dismissed";
