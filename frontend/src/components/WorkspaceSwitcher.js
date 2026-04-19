import { useState, useEffect } from "react";
import workspaceService from "../services/workspaceService";

export default function WorkspaceSwitcher({
  currentUser,
  currentWorkspaceId,
  onSelectWorkspace,
}) {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const fetchWorkspaces = async () => {
      try {
        const data = await workspaceService.getUserWorkspaces(currentUser.id);
        setWorkspaces(data);
      } catch (err) {
        console.error("Failed to load workspaces:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [currentUser]);

  return (
    <aside className="workspace-switcher">
      <div className="switcher-header">
        <div className="switcher-title">Spaces</div>
      </div>

      <div className="workspaces-scroll">
        {loading ? (
          <div className="switcher-loading">Loading...</div>
        ) : workspaces.length === 0 ? (
          <div className="switcher-empty">No workspaces</div>
        ) : (
          workspaces.map((ws) => (
            <button
              key={ws.id}
              className={`workspace-icon ${
                parseInt(currentWorkspaceId) === ws.id ? "active" : ""
              }`}
              title={ws.name}
              onClick={() => onSelectWorkspace(ws.id)}
            >
              <span className="icon-letter">{ws.name[0].toUpperCase()}</span>
            </button>
          ))
        )}
      </div>

      <div className="switcher-footer">
        <a href="/dashboard" className="dashboard-link" title="Go to Dashboard">
          🏠
        </a>
      </div>
    </aside>
  );
}
