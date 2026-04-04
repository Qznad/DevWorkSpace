import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import workspaceService from "../services/wss";
import "./Dashboard.css";

const currentUser = {
  id: 2,
  name: "Bob",
  email: "bob@example.com",
};

export default function Dashboard() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const navigate = useNavigate();

  // Fetch user workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        const data = await workspaceService.getUserWorkspaces(currentUser.id);
        setWorkspaces(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load workspaces.");
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  // Create workspace
  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return alert("Workspace name cannot be empty.");
    try {
      const workspace = await workspaceService.createWorkspace(
        currentUser.id,
        newWorkspaceName.trim()
      );
      // Convert to DTO structure if needed
      const workspaceDto = {
        id: workspace.id,
        name: workspace.name,
        ownerName: currentUser.name,
        ownerEmail: currentUser.email,
      };
      setWorkspaces([...workspaces, workspaceDto]);
      setNewWorkspaceName("");
    } catch (err) {
      console.error(err);
      alert("Failed to create workspace.");
    }
  };

  // Delete workspace
  const handleDeleteWorkspace = async (workspaceId) => {
    if (!window.confirm("Are you sure you want to delete this workspace?")) return;
    try {
      await workspaceService.deleteWorkspace(workspaceId, currentUser.id);
      setWorkspaces(workspaces.filter((ws) => ws.id !== workspaceId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete workspace. Only the owner can delete it.");
    }
  };

  return (
    <div className="dashboard-layout">
      <aside className="workspace-sidebar">
        <h3>Workspaces</h3>
        <div className="workspace-icons">
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              className="workspace-icon-circle"
              title={ws.name}
              onClick={() => navigate(`/workspace/${ws.id}`)}
            >
              {ws.name[0].toUpperCase()}

              {ws.ownerEmail === currentUser.email && (
                <span
                  className="workspace-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteWorkspace(ws.id);
                  }}
                >
                  ×
                </span>
              )}
            </div>
          ))}
        </div>
      </aside>

      <main className="dashboard-main">
        <h2>Welcome, {currentUser.name}</h2>

        <div className="create-workspace">
          <input
            type="text"
            placeholder="New workspace name"
            value={newWorkspaceName}
            onChange={(e) => setNewWorkspaceName(e.target.value)}
          />
          <button onClick={handleCreateWorkspace}>Create Workspace</button>
        </div>

        {loading ? (
          <p className="loading">Loading your workspaces...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : workspaces.length === 0 ? (
          <p>You are not a member of any workspace yet.</p>
        ) : (
          <div className="workspace-grid">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                className="workspace-card"
                onClick={() => navigate(`/workspace/${ws.id}`)}
              >
                <div className="workspace-icon-circle-large">
                  {ws.name[0].toUpperCase()}

                  {ws.ownerEmail === currentUser.email && (
                    <span
                      className="workspace-delete-btn-large"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWorkspace(ws.id);
                      }}
                    >
                      ×
                    </span>
                  )}
                </div>
                <div className="workspace-name">{ws.name}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}