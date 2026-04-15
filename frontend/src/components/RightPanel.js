export default function RightPanel({
  activeTab,
  setActiveTab,
  children,
}) {
  return (
    <aside className="right-panel">
      <div className="panel-tabs">
        <button
          className={`panel-tab ${activeTab === "members" ? "active" : ""}`}
          onClick={() => setActiveTab("members")}
        >
          👥 Members
        </button>
        <button
          className={`panel-tab ${activeTab === "announcements" ? "active" : ""}`}
          onClick={() => setActiveTab("announcements")}
        >
          📢 News
        </button>
        <button
          className={`panel-tab ${activeTab === "assignments" ? "active" : ""}`}
          onClick={() => setActiveTab("assignments")}
        >
          ✓ Tasks
        </button>
        <button
          className={`panel-tab ${activeTab === "files" ? "active" : ""}`}
          onClick={() => setActiveTab("files")}
        >
          📎 Files
        </button>
      </div>
      <div className="panel-content">
        {children}
      </div>
    </aside>
  );
}
