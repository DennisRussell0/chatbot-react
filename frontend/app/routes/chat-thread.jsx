import { useState } from "react";
import { ChatMessages, ChatInput } from "../components/Chat.jsx";

const defaultMessages = [
  {
    id: 1,
    type: "user",
    content: "This is the user's original message",
  },
  {
    id: 2,
    type: "bot",
    content: "This is the first bot response",
  },
];

export default function ChatThread() {
  const [messages, setMessages] = useState(defaultMessages);

  const addMessage = (content) => {
    const newMessage = {
      id: messages.length + 1,
      type: "user",
      content: content,
    };

    setMessages([...messages, newMessage]);
  };

  return (
    <main className="chat-container">
      <ChatMessages messages={messages} />
      <ChatInput onAddMessage={addMessage} />
    </main>
  );
}
