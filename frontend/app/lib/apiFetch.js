import { supabase } from "./supabase.js";

export async function apiFetch(path, options = {}) {
  // Allow a configured API URL via VITE_API_URL, but fall back to the
  // local backend default used by this project (http://localhost:3000)
  // so the client doesn't accidentally hit the Vite dev server (which
  // would return 404 for API routes).
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Ensure path is properly combined: path should start with a leading '/'
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${apiUrl.replace(/\/$/, "")}${normalizedPath}`;

  // Helpful debug log while developing
  // eslint-disable-next-line no-console
  console.debug("apiFetch ->", url, options?.method || "GET");

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
