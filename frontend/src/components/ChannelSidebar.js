export default function ChannelSidebar({
  channels,
  selectedChannel,
  onSelectChannel,
  onCreateChannel,
  onDeleteChannel,
  isOwner,
  newChannelName,
  setNewChannelName,
}) {
  return (
    <aside className="channel-sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">Channels</h2>
      </div>

      <div className="channels-list">
        {channels.length === 0 ? (
          <div className="empty-channels">No channels yet</div>
        ) : (
          channels.map((ch) => (
            <div
              key={ch.id}
              className={`channel-item ${selectedChannel?.id === ch.id ? "active" : ""}`}
              onClick={() => onSelectChannel(ch)}
            >
              <span className="channel-hash">#</span>
              <span className="channel-name">{ch.name}</span>
              {isOwner && (
                <button
                  className="channel-delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChannel(ch.id);
                  }}
                  title="Delete channel"
                >
                  ×
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {isOwner && (
        <div className="channel-create-section">
          <input
            type="text"
            placeholder="Create channel"
            className="channel-input"
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onCreateChannel()}
          />
          <button className="channel-add-btn" onClick={onCreateChannel}>
            Add Channel
          </button>
        </div>
      )}
    </aside>
  );
}
