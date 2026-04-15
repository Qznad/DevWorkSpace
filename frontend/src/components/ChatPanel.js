import { useEffect, useRef } from "react";

export default function ChatPanel({
  selectedChannel,
  messages,
  currentUser,
  newMessage,
  setNewMessage,
  onSendMessage,
  onDeleteMessage,
  onMessageClick,
}) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Small delay to ensure DOM has updated
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  useEffect(() => {
    // Scroll to bottom when channel changes
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    }, 200);
    return () => clearTimeout(timeoutId);
  }, [selectedChannel]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="chat-panel">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <p>No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-item ${msg.senderId === currentUser.id ? "own-message" : ""}`}
              onClick={() => onMessageClick(msg)}
            >
              <div className="message-avatar">
                {msg.senderName && msg.senderName.length > 0 
                  ? msg.senderName[0].toUpperCase() 
                  : msg.senderInitial || "U"}
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-author">{msg.senderName}</span>
                  <span className="message-time">
                    {new Date(msg.createdAt || msg.timestamp || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="message-text">{msg.content}</div>
                {msg.senderId === currentUser.id && (
                  <button className="message-delete-btn" onClick={() => onDeleteMessage(msg.id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {selectedChannel && (
        <div className="message-input-area">
          <textarea
            className="message-input"
            placeholder={`Message #${selectedChannel.name}`}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            rows="3"
          />
          <button className="send-button" onClick={onSendMessage} disabled={!newMessage.trim()}>
            Send
          </button>
        </div>
      )}
    </div>
  );
}
