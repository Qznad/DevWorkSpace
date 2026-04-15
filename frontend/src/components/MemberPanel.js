export default function MemberPanel({
  members,
  users,
  currentUser,
  isOwner,
  newMemberEmail,
  setNewMemberEmail,
  onAddMember,
  onRemoveMember,
}) {
  return (
    <div className="panel-section">
      <h3 className="panel-title">Workspace Members</h3>
      <div className="members-list">
        {members.length === 0 ? (
          <div className="empty-state-small">No members yet</div>
        ) : (
          members.map((member) => (
            <div key={member.userId} className="member-card">
              <div className="member-avatar">{member.userName?.[0] || "?"}</div>
              <div className="member-info">
                <div className="member-name">{member.userName}</div>
                <div className="member-email">{member.email}</div>
              </div>
              {isOwner && member.userId !== currentUser.id && (
                <button
                  className="member-remove"
                  onClick={() => onRemoveMember(member.id, member.userId)}
                  title="Remove member"
                >
                  ×
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {isOwner && (
        <div className="form-group">
          <input
            type="email"
            placeholder="Invite by email"
            className="invite-input"
            value={newMemberEmail}
            onChange={(e) => setNewMemberEmail(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && onAddMember()}
          />
          <button className="invite-btn" onClick={onAddMember}>
            Invite
          </button>
        </div>
      )}

      {users.length > 0 && (
        <>
          <h3 className="panel-title">Directory</h3>
          <div className="users-list">
            {users.slice(0, 8).map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-avatar">{user.name?.[0] || "?"}</div>
                <div className="user-info">
                  <div className="user-name">{user.name}</div>
                  <div className="user-email">{user.email}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
