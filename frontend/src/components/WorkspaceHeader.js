export default function WorkspaceHeader({
  workspace,
  currentUser,
  isOwner,
  onLogout,
}) {
  return (
    <header className="workspace-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="workspace-name">{workspace?.name || "Workspace"}</h1>
          <p className="header-subtitle">
            {currentUser?.name} • {isOwner ? "Owner" : "Member"}
          </p>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}
