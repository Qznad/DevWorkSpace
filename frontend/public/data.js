

const currentUser = {
  "id": 1,
  "name": "Fletcher Johnson",
  "email": "fletcher@devworkspace.com"
};

const users = [
  { "id": 1, "name": "Fletcher Johnson", "email": "fletcher@devworkspace.com" },
  { "id": 2, "name": "Alice", "email": "alice@example.com" },
  { "id": 3, "name": "Bob", "email": "bob@example.com" },
  { "id": 6, "name": "Yassine", "email": "test@example.com" },
  { "id": 7, "name": "ali", "email": "ali@example.com" },
  { "id": 9, "name": "Kenny", "email": "kenny@gmail.com" }
];

const userWorkspaces = [
  { "id": 1, "name": "Dev Workspace", "ownerName": "Fletcher Johnson", "ownerEmail": "fletcher@devworkspace.com", "members": 24 },
  { "id": 2, "name": "Project Beta", "ownerName": "Bob", "ownerEmail": "bob@example.com", "members": 8 },
  { "id": 8, "name": "Project Delta", "ownerName": "Bob", "ownerEmail": "bob@example.com", "members": 12 }
];

const workspaceChannels = [
  { "id": 1, "name": "general", "workspaceId": 1, "type": "public", "members": 24 },
  { "id": 2, "name": "announcements", "workspaceId": 1, "type": "public", "members": 24 },
  { "id": 3, "name": "random", "workspaceId": 1, "type": "public", "members": 18 },
  { "id": 4, "name": "dev-help", "workspaceId": 1, "type": "public", "members": 15 },
  { "id": 5, "name": "project-alpha", "workspaceId": 1, "type": "private", "members": 7 }
];

const channelMessages = [
  {
    "id": 71,
    "channelId": 1,
    "channelName": "general",
    "content": "Hey everyone! Welcome to Dev Workspace 🎉",
    "createdAt": "2026-04-09T10:30:24.885625",
    "senderId": 3,
    "senderName": "Bob"
  },
  {
    "id": 72,
    "channelId": 1,
    "channelName": "general",
    "content": "Thanks for setting this up! Really excited to collaborate here.",
    "createdAt": "2026-04-09T10:35:09.095459",
    "senderId": 2,
    "senderName": "Alice"
  },
  {
    "id": 73,
    "channelId": 1,
    "channelName": "general",
    "content": "Glad to have everyone here. Let's build something amazing together!",
    "createdAt": "2026-04-09T10:40:05.481234",
    "senderId": 1,
    "senderName": "Fletcher Johnson"
  },
  {
    "id": 74,
    "channelId": 1,
    "channelName": "general",
    "content": "What's the first project we're tackling?",
    "createdAt": "2026-04-09T10:45:24.885625",
    "senderId": 9,
    "senderName": "Kenny"
  },
  {
    "id": 75,
    "channelId": 2,
    "channelName": "announcements",
    "content": "📢 Dev Workspace is now live! All team members have access.",
    "createdAt": "2026-04-09T09:00:24.885625",
    "senderId": 1,
    "senderName": "Fletcher Johnson"
  },
  {
    "id": 76,
    "channelId": 2,
    "channelName": "announcements",
    "content": "🎯 Sprint Planning meeting scheduled for tomorrow at 2 PM.",
    "createdAt": "2026-04-09T11:20:09.095459",
    "senderId": 3,
    "senderName": "Bob"
  }
];