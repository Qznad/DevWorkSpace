--USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

--WORKSPACES
CREATE TABLE workspaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    owner_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_workspace_owner
        FOREIGN KEY (owner_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

--WORKSPACE_MEMBERS (Many-to-Many)
CREATE TABLE workspace_members (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    workspace_id INT NOT NULL,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_member_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_member_workspace
        FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE,
    CONSTRAINT unique_member UNIQUE (user_id, workspace_id)
);

--CHANNELS
CREATE TABLE channels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    workspace_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_channel_workspace
        FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE
);

--MESSAGES
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INT NOT NULL,
    channel_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_message_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_message_channel
        FOREIGN KEY (channel_id)
        REFERENCES channels(id)
        ON DELETE CASCADE
);

--ANNOUNCEMENTS
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    workspace_id INT NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_announcement_workspace
        FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE, 
    CONSTRAINT fk_announcement_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);

--ASSIGNMENTS
CREATE TABLE assignments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date TIMESTAMP,
    workspace_id INT NOT NULL,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_assignment_workspace
        FOREIGN KEY (workspace_id)
        REFERENCES workspaces(id)
        ON DELETE CASCADE,
        
    CONSTRAINT fk_assignment_user
        FOREIGN KEY (created_by)
        REFERENCES users(id)
        ON DELETE CASCADE
);

--FILES
CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    uploaded_by INT NOT NULL,
    message_id INT,
    assignment_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_file_user
        FOREIGN KEY (uploaded_by)
        REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_file_message
        FOREIGN KEY (message_id)
        REFERENCES messages(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_file_assignment
        FOREIGN KEY (assignment_id)
        REFERENCES assignments(id)
        ON DELETE CASCADE
);

--INDEXES (Performance Boost)
CREATE INDEX idx_messages_channel ON messages(channel_id);
CREATE INDEX idx_messages_user ON messages(user_id);
CREATE INDEX idx_channels_workspace ON channels(workspace_id);
CREATE INDEX idx_workspace_members_user ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);