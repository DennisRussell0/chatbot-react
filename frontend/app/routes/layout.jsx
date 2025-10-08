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

export default function Layout() {
  const { threads } = useLoaderData();

  const deleteThread = (threadId) => {
    console.log("Layout: Deleting thread with ID:", threadId);
    console.log("Mutations will be implemented later");
  };

  return (
    <div className="app-layout">
      <Sidebar threads={threads} onDeleteThread={deleteThread} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
