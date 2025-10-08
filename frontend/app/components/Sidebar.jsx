import { useState } from "react";
import { href, Link, NavLink } from "react-router";

function SidebarHeader() {
  return (
    <div className="sidebar-header">
      <h2 className="chatbot-title">Chatbot</h2>
      <Link to="/chat/new" className="new-chat-btn">
        + New
      </Link>
    </div>
  );
}

function ChatThreadItem({ thread, onDeleteThread }) {
  const { id, title } = thread;

  const handleDeleteClick = (event) => {
    event.stopPropagation();

    if (onDeleteThread) {
      onDeleteThread(id);
    }
  };

  return (
    <li className="chat-thread-item">
      <div className="chat-thread-item-content">
        <NavLink
          to={href("chat/:threadId", { threadId: id })}
          className={({ isActive }) =>
            isActive
              ? "chat-thread-link chat-thread-link-active"
              : "chat-thread-link"
          }
        >
          {title}
        </NavLink>
        <button
          className="delete-thread-btn"
          aria-label={`Delete thread: ${title}`}
          title="Delete this conversation"
          type="button"
          onClick={handleDeleteClick}
        >
          &times;
        </button>
      </div>
    </li>
  );
}

function ChatThreadList({ threads = [], onDeleteThread }) {
  const [searchValue, setSearchValue] = useState("");

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(searchValue.toLocaleLowerCase()),
  );

  return (
    <nav className="chat-threads-list" aria-label="Chat threads">
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search conversations..."
          value={searchValue}
          onChange={handleSearchChange}
        />
      </div>
      <ul>
        {filteredThreads.map((thread) => (
          <ChatThreadItem
            key={thread.id}
            thread={thread}
            onDeleteThread={onDeleteThread}
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

export default function Sidebar({ threads, onDeleteThread }) {
  return (
    <aside className="sidebar">
      <SidebarHeader />
      <ChatThreadList threads={threads} onDeleteThread={onDeleteThread} />
      <SidebarFooter />
    </aside>
  );
}
