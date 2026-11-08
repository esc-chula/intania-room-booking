const KEY = "auth:next";

/** Only same-site paths, so a link cannot send someone to another site after sign-in. */
export function safeNextPath(value: string | null | undefined) {
  if (!value?.startsWith("/") || value.startsWith("//")) return null;
  if (value.startsWith("/login") || value.includes("\\")) return null;
  return value;
}

// Google sends people back to the site root, so the page they wanted is kept
// in this browser tab while they are away.
export function rememberNextPath(path: string | null) {
  try {
    if (path) sessionStorage.setItem(KEY, path);
  } catch {
    // Storage can be blocked. They land on their home page instead.
  }
}

export function takeNextPath() {
  try {
    const path = safeNextPath(sessionStorage.getItem(KEY));
    sessionStorage.removeItem(KEY);
    return path;
  } catch {
    return null;
  }
}
