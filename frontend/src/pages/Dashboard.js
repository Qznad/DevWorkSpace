import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import workspaceService from "../services/workspaceService";
import { getCurrentUser } from "../services/auth";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newWorkspaceName, setNewWorkspaceName] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

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
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, [currentUser]);

  // Create new workspace
  const handleCreateWorkspace = async (e) => {
    e.preventDefault();
    if (!newWorkspaceName.trim()) return;
    try {
      const workspace = await workspaceService.createWorkspace(
        currentUser.id,
        newWorkspaceName.trim()
      );
      setWorkspaces([...workspaces, workspace]);
      setNewWorkspaceName("");
      setShowCreateForm(false);
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

  // Logout
  const handleLogout = () => {
    // Clear both sessionStorage and localStorage
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Protect rendering until currentUser is loaded
  if (!currentUser) return null;

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="header-title">Workspaces</h1>
          <div className="header-actions">
            <span className="user-info">👤 {currentUser.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Sign Out</button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-content">
          {/* Create Workspace Section */}
          {!showCreateForm && (
            <button className="create-new-btn" onClick={() => setShowCreateForm(true)}>
              + Create New Workspace
            </button>
          )}

          {showCreateForm && (
            <div className="create-workspace-form-card">
              <h2>Create New Workspace</h2>
              <form onSubmit={handleCreateWorkspace}>
                <input
                  type="text"
                  placeholder="Workspace name (e.g., Design Team, Marketing)"
                  value={newWorkspaceName}
                  onChange={(e) => setNewWorkspaceName(e.target.value)}
                  autoFocus
                  required
                  className="workspace-input"
                />
                <div className="form-buttons">
                  <button type="submit" className="btn-create">Create</button>
                  <button type="button" className="btn-cancel" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Workspaces Section */}
          <section className="workspaces-section">
            <h2 className="section-title">Your Workspaces</h2>
            
            {loading ? (
              <div className="state-message loading">⏳ Loading your workspaces...</div>
            ) : error ? (
              <div className="state-message error">❌ {error}</div>
            ) : workspaces.length === 0 ? (
              <div className="state-message empty">
                <p>No workspaces yet</p>
                <p className="empty-hint">Create your first workspace to get started</p>
              </div>
            ) : (
              <div className="workspace-grid">
                {workspaces.map((ws) => (
                  <div
                    key={ws.id}
                    className="workspace-card"
                    onClick={() => navigate(`/workspace/${ws.id}`)}
                  >
                    <div className="card-header">
                      <div className="workspace-avatar">
                        {ws.name[0].toUpperCase()}
                      </div>
                      {ws.ownerEmail === currentUser.email && (
                        <button
                          className="delete-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteWorkspace(ws.id, ws.ownerEmail);
                          }}
                          title="Delete workspace (owner only)"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="card-body">
                      <h3 className="workspace-card-name">{ws.name}</h3>
                      <p className="workspace-owner">
                        {ws.ownerEmail === currentUser.email ? "📌 You own this" : "👥 Member"}
                      </p>
                    </div>
                    <div className="card-footer">
                      <span className="btn-open">Open →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}