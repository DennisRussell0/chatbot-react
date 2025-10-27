import { ChatMessages, ChatInput } from "../components/Chat.jsx";
import { redirect, useActionData } from "react-router";

export async function clientAction({ request }) {
  const apiUrl = import.meta.env.VITE_API_URL;

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
    const response = await fetch(`${apiUrl}/api/threads`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: title,
        content: content.trim(),
      }),
    });

    if (response.status === 400) {
      const error = await response.json();
      return { error: error.error || "Invalid thread data." };
    }

    if (!response.ok) {
      return { error: `Failed to create thread: ${response.status}` };
    }

    const data = await response.json();

    return redirect(`/chat/${data.thread.id}`);
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
