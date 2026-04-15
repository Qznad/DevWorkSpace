export default function AnnouncementPanel({
  announcements,
  currentUser,
  newTitle,
  setNewTitle,
  newContent,
  setNewContent,
  onCreate,
  onDelete,
}) {
  const handleCreate = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    await onCreate();
    setNewTitle("");
    setNewContent("");
  };

  return (
    <div className="panel-section">
      <h3 className="panel-title">Announcements</h3>

      <div className="form-group announcement-form">
        <input
          type="text"
          placeholder="Announcement title"
          className="form-input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          placeholder="Share important updates"
          className="form-textarea"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows="3"
        />
        <button className="btn-primary" onClick={handleCreate}>
          Publish
        </button>
      </div>

      <div className="announcements-list">
        {announcements.length === 0 ? (
          <div className="empty-state-small">No announcements yet</div>
        ) : (
          announcements.map((item) => (
            <div key={item.id} className="announcement-item">
              <h4 className="announcement-title">{item.title}</h4>
              <p className="announcement-content">{item.content}</p>
              <div className="announcement-footer">
                <span className="announcement-meta">
                  {new Date(item.createdAt || Date.now()).toLocaleDateString()}
                </span>
                <button className="btn-delete" onClick={() => onDelete(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
