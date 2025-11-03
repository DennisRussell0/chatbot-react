import { redirect } from "react-router";
import { supabase } from "./supabase.js";

export async function apiFetch(path, options = {}) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${apiUrl.replace(/\/$/, "")}${normalizedPath}`;

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

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    throw redirect("/login");
  }

  return response;
}
