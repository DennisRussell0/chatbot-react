import { useState } from "react";
import { Form } from "react-router";

function Message({ type = "user", children }) {
  return (
    <div className={`message ${type}-message`}>
      <div className="message-content">{children}</div>
    </div>
  );
}

function ChatMessages({ messages = [] }) {
  return (
    <div className="chat-messages">
      {messages.map((message) => (
        <Message key={message.id} type={message.type}>
          {message.content}
        </Message>
      ))}
    </div>
  );
}

function ChatInput() {
  return (
    <div className="chat-input-container">
      <Form className="chat-input-wrapper" method="post">
        <textarea
          name="message"
          className="chat-input"
          placeholder="Type your message here..."
          rows="1"
          required
        />
        <button className="send-button" type="submit">
          Send
        </button>
      </Form>
    </div>
  );
}

export { Message, ChatMessages, ChatInput };
