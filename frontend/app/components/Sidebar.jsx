function SidebarHeader() {
  return (
    <div className="sidebar-header">
      <h2 className="chatbot-title">Chatbot</h2>
      <a href="/chat/new" className="new-chat-btn">
        + New
      </a>
    </div>
  );
}

function ChatThreadItem(props) {
  return (
    <li className="chat-thread-item">
      <a href={props.href} className="chat-thread-link">
        {props.title}
      </a>
    </li>
  );
}

function ChatThreadList() {
  const threads = [
    {
      id: 1,
      href: "/chat/how-to-learn-programming",
      title: "How to learn programming?",
    },
    {
      id: 2,
      href: "/chat/best-pizza-toppings",
      title: "What are the best pizza toppings?",
    },
    {
      id: 3,
      href: "/chat/explain-quantum-physics",
      title: "Can you explain quantum physics?",
    },
    {
      id: 4,
      href: "/chat/morning-routine-ideas",
      title: "Help me create a morning routine",
    },
    {
      id: 5,
      href: "/chat/weekend-activity-suggestions",
      title: "What should I do this weekend?",
    },
    { id: 6, href: "/chat/why-sky-blue", title: "Why is the sky blue?" },
    {
      id: 7,
      href: "/chat/learn-new-language",
      title: "How do I learn a new language?",
    },
    {
      id: 8,
      href: "/chat/meaning-of-life",
      title: "What's the meaning of life?",
    },
    { id: 9, href: "/chat/funny-joke-please", title: "Tell me a funny joke" },
    {
      id: 10,
      href: "/chat/healthy-dinner-ideas",
      title: "What's a healthy dinner idea?",
    },
    {
      id: 11,
      href: "/chat/good-book-recommendations",
      title: "Recommend me a good book",
    },
    {
      id: 12,
      href: "/chat/creative-writing-prompt",
      title: "Give me a creative writing prompt",
    },
    {
      id: 13,
      href: "/chat/fix-slow-computer",
      title: "My computer is slow, help?",
    },
    {
      id: 14,
      href: "/chat/interesting-history-fact",
      title: "Tell me an interesting history fact",
    },
  ];

  return (
    <nav className="chat-threads-list" aria-label="Chat threads">
      <ul>
        {threads.map((thread) => (
          <ChatThreadItem
            key={thread.id}
            href={thread.href}
            title={thread.title}
          />
        ))}
      </ul>
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="sidebar-footer">
      <a href="/profile" className="user-profile">
        <img
          src="https://ui-avatars.com/api/?name=Batman&background=0D0D0D&color=fff&size=40"
          alt="User avatar"
          className="user-avatar"
          width={30}
          height={30}
        />
        <span className="user-name">Batman</span>
      </a>
    </div>
  );
}

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <SidebarHeader />
      <ChatThreadList />
      <SidebarFooter />
    </aside>
  );
}
