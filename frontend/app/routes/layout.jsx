import { useLoaderData, Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

export async function clientLoader() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const url = `${supabaseUrl}/rest/v1/threads?select=*&order=created_at.desc`;

  const response = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch threads: ${response.status}`);
  }

  const threads = await response.json();

  return { threads };
}

export async function clientAction({ request }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const formData = await request.formData();
  const intent = formData.get("intent");
  const threadId = formData.get("threadId");

  if (intent === "delete" && threadId) {
    try {
      const response = await fetch(
        `${supabaseUrl}/rest/v1/threads?id=eq.${threadId}`,
        {
          method: "DELETE",
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        },
      );

      if (!response.ok) {
        return { error: `Failed to delete thread: ${response.status}` };
      }

      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  }

  return null;
}

export default function Layout() {
  const { threads } = useLoaderData();

  return (
    <div className="app-layout">
      <Sidebar threads={threads} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
