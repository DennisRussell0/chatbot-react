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

function ChatThreadItem({ href, title }) {
  return (
    <li className="chat-thread-item">
      <div className="chat-thread-item-content">
        <a href={href} className="chat-thread-link">
          {title}
        </a>
        <button
          className="delete-thread-btn"
          aria-label={`Delete thread: ${title}`}
          title="Delete this conversation"
          type="button"
        >
          &times;
        </button>
      </div>
    </li>
  );
}

function ChatThreadList({ threads = [] }) {
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

export default function Sidebar({ threads }) {
  return (
    <aside className="sidebar">
      <SidebarHeader />
      <ChatThreadList threads={threads} />
      <SidebarFooter />
    </aside>
  );
}
