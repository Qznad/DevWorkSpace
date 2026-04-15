export default function FilePanel({
  selectedMessage,
  selectedAssignment,
  messageAttachments,
  assignmentAttachments,
  allFiles,
  newFileName,
  setNewFileName,
  newFileUrl,
  setNewFileUrl,
  fileContext,
  setFileContext,
  onUpload,
  onDelete,
}) {
  const isMessageContext = fileContext === "message";

  return (
    <div className="panel-section">
      <h3 className="panel-title">Files</h3>

      <div className="file-context-tabs">
        <button
          className={`tab ${isMessageContext ? "active" : ""}`}
          onClick={() => setFileContext("message")}
        >
          Message Files
        </button>
        <button
          className={`tab ${!isMessageContext ? "active" : ""}`}
          onClick={() => setFileContext("assignment")}
        >
          Task Files
        </button>
      </div>

      <div className="file-context-info">
        {isMessageContext && (
          <p>{selectedMessage ? `Attaching to: "${selectedMessage.content}"` : "Select a message to attach files"}</p>
        )}
        {!isMessageContext && (
          <p>{selectedAssignment ? `Attaching to: "${selectedAssignment.title}"` : "Select a task to attach files"}</p>
        )}
      </div>

      <div className="form-group file-form">
        <input
          type="text"
          placeholder="File name"
          className="form-input"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
        />
        <input
          type="text"
          placeholder="File URL"
          className="form-input"
          value={newFileUrl}
          onChange={(e) => setNewFileUrl(e.target.value)}
        />
        <button className="btn-primary" onClick={onUpload} disabled={!newFileName.trim() || !newFileUrl.trim()}>
          Attach File
        </button>
      </div>

      <div className="files-list">
        {isMessageContext ? (
          <>
            <h4 className="files-subtitle">Message Attachments</h4>
            {messageAttachments.length === 0 ? (
              <div className="empty-state-small">No files attached</div>
            ) : (
              messageAttachments.map((file) => (
                <div key={file.id} className="file-item">
                  <a href={file.fileUrl} target="_blank" rel="noreferrer" className="file-link">
                    📎 {file.filename}
                  </a>
                  <button className="btn-delete" onClick={() => onDelete(file.id)}>
                    Delete
                  </button>
                </div>
              ))
            )}
          </>
        ) : (
          <>
            <h4 className="files-subtitle">Task Attachments</h4>
            {assignmentAttachments.length === 0 ? (
              <div className="empty-state-small">No files attached</div>
            ) : (
              assignmentAttachments.map((file) => (
                <div key={file.id} className="file-item">
                  <a href={file.fileUrl} target="_blank" rel="noreferrer" className="file-link">
                    📎 {file.filename}
                  </a>
                  <button className="btn-delete" onClick={() => onDelete(file.id)}>
                    Delete
                  </button>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {allFiles.length > 0 && (
        <>
          <h4 className="files-subtitle">Recent Files</h4>
          <div className="recent-files">
            {allFiles.slice(0, 5).map((file) => (
              <div key={file.id} className="recent-file-item">
                <a href={file.fileUrl} target="_blank" rel="noreferrer" className="file-link">
                  📎 {file.filename}
                </a>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
