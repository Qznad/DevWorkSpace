export default function AssignmentPanel({
  assignments,
  selectedAssignment,
  currentUser,
  newTitle,
  setNewTitle,
  newDescription,
  setNewDescription,
  newDueDate,
  setNewDueDate,
  onCreate,
  onDelete,
  onSelect,
}) {
  const handleCreate = async () => {
    if (!newTitle.trim() || !newDescription.trim() || !newDueDate) return;
    await onCreate();
    setNewTitle("");
    setNewDescription("");
    setNewDueDate("");
  };

  return (
    <div className="panel-section">
      <h3 className="panel-title">Tasks</h3>

      <div className="form-group assignment-form">
        <input
          type="text"
          placeholder="Task title"
          className="form-input"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <textarea
          placeholder="Task details"
          className="form-textarea"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          rows="2"
        />
        <input
          type="date"
          className="form-input"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
        />
        <button className="btn-primary" onClick={handleCreate}>
          Create Task
        </button>
      </div>

      <div className="assignments-list">
        {assignments.length === 0 ? (
          <div className="empty-state-small">No tasks yet</div>
        ) : (
          assignments.map((item) => (
            <div
              key={item.id}
              className={`assignment-item ${selectedAssignment?.id === item.id ? "selected" : ""}`}
              onClick={() => onSelect(item)}
            >
              <h4 className="assignment-title">{item.title}</h4>
              <p className="assignment-description">{item.description}</p>
              <div className="assignment-footer">
                <span className="assignment-due">
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </span>
                <button className="btn-delete" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}>
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
