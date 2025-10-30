import { useLoaderData, Outlet } from "react-router";
import Sidebar from "../components/Sidebar.jsx";
import { apiFetch } from "../lib/apiFetch.js";

export async function clientLoader() {
  const response = await apiFetch("/api/threads");

  if (!response.ok) {
    throw new Error(`Failed to fetch threads: ${response.status}`);
  }

  const threads = await response.json();

  return { threads };
}

export async function clientAction({ request }) {
  const apiUrl = import.meta.env.VITE_API_URL;

  const formData = await request.formData();
  const intent = formData.get("intent");
  const threadId = formData.get("threadId");

  if (intent === "delete" && threadId) {
    try {
      const response = await apiFetch(`/api/threads/${threadId}`, {
        method: "DELETE",
      });

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
