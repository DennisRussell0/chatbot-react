import { useLoaderData } from "react-router";
import { ChatMessages, ChatInput } from "../components/Chat.jsx";

export async function clientLoader({ params }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const threadUrl = `${supabaseUrl}/rest/v1/threads?id=eq.${params.threadId}&select=*`;

  const threadResponse = await fetch(threadUrl, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!threadResponse.ok) {
    throw new Error(`Failed to fetch thread: ${threadResponse.status}`);
  }

  const threadData = await threadResponse.json();
  const thread = threadData[0];

  if (!thread) {
    throw new Response("Thread not found", { status: 404 });
  }

  const messagesUrl = `${supabaseUrl}/rest/v1/messages?thread_id=eq.${params.threadId}&select=*&order=created_at.asc`;

  const messagesResponse = await fetch(messagesUrl, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!messagesResponse.ok) {
    throw new Error(`Failed to fetch messages: ${messagesResponse.status}`);
  }

  const messages = await messagesResponse.json();

  return { thread, messages };
}

export async function clientAction({ params, request }) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const formData = await request.formData();
  const content = formData.get("message");

  const newMessage = {
    thread_id: params.threadId,
    type: "user",
    content: content,
  };

  const response = await fetch(`${supabaseUrl}/rest/v1/messages`, {
    method: "POST",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newMessage),
  });

  if (!response.ok) {
    throw new Error(`Failed to create message: ${response.status}`);
  }

  return { success: true };
}

export default function ChatThread() {
  const { thread, messages } = useLoaderData();

  const addMessage = (content) => {
    console.log("Message submitted:", content);
    console.log("Data mutations will be implemented later");
  };

  return (
    <main className="chat-container">
      <div className="chat-thread-header">
        <h2>{thread.title}</h2>
      </div>
      <ChatMessages messages={messages} />
      <ChatInput />
    </main>
  );
}
