import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import workspaceService from "../services/wss";
import { getCurrentUser } from "../services/auth"; // make sure you have this helper
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");

  // Load current user from localStorage
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  // Fetch workspaces after user is loaded
  useEffect(() => {
    if (!currentUser) return;

    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        const data = await workspaceService.getUserWorkspaces(currentUser.id);
        setWorkspaces(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load workspaces.");
      } finally {
        setLoading(false); // ✅ stop infinite loading
      }
    };

    fetchWorkspaces();
  }, [currentUser]);

  // Create new workspace
  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return alert("Workspace name cannot be empty.");
    try {
      const workspace = await workspaceService.createWorkspace(
        currentUser.id,
        newWorkspaceName.trim()
      );
      setWorkspaces([...workspaces, workspace]);
      setNewWorkspaceName("");
    } catch (err) {
      console.error(err);
      alert("Failed to create workspace.");
    }
  };

  // Delete workspace
  const handleDeleteWorkspace = async (workspaceId, ownerEmail) => {
    if (ownerEmail !== currentUser.email) {
      alert("Only the owner can delete this workspace.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this workspace?")) return;

    try {
      await workspaceService.deleteWorkspace(workspaceId, currentUser.id);
      setWorkspaces(workspaces.filter((ws) => ws.id !== workspaceId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete workspace.");
    }
  };

  // Protect rendering until currentUser is loaded
  if (!currentUser) return null;

  return (
    <div className="dashboard-layout">
      <aside className="workspace-sidebar">
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
                    handleDeleteWorkspace(ws.id, ws.ownerEmail);
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
                        handleDeleteWorkspace(ws.id, ws.ownerEmail);
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