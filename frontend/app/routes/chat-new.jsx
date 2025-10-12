import { ChatMessages, ChatInput } from "../components/Chat.jsx";
import { redirect, useActionData } from "react-router";

export async function clientAction({ request }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const formData = await request.formData();
  const content = formData.get("message");

  if (!content || !content.trim()) {
    return { error: "Message cannot be empty." };
  }

  const title =
    content.trim().length > 50
      ? content.trim().slice(0, 50) + "..."
      : content.trim();

  try {
    const threadResponse = await fetch(`${supabaseUrl}/rest/v1/threads`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ title }),
    });

    if (!threadResponse.ok) {
      return { error: `Failed to create thread: ${threadResponse.status}` };
    }

    const [thread] = await threadResponse.json();

    const messageResponse = await fetch(`${supabaseUrl}/rest/v1/messages`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({
        thread_id: thread.id,
        type: "user",
        content: content.trim(),
      }),
    });

    if (!messageResponse.ok) {
      return { error: `Failed to create message: ${messageResponse.status}` };
    }

    return redirect(`/chat/${thread.id}`);
  } catch (error) {
    return { error: error.message };
  }
}

export default function ChatNew() {
  const actionData = useActionData();

  return (
    <main className="chat-container">
      <div className="chat-thread-header">
        <h2>Start a new conversation</h2>
        <p>Type a message below to begin chatting</p>
      </div>
      <ChatMessages />
      <ChatInput />
      {actionData?.error && (
        <div className="error-message">{actionData.error}</div>
      )}
    </main>
  );
}
