# DevWorkspace

[![Java](https://img.shields.io/badge/Java-17-blue)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.3-green)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.4-blue)](https://reactjs.org/)
[![Electron](https://img.shields.io/badge/Electron-41.1.1-black)](https://electronjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A modern, full-stack **workspace collaboration platform** that enables teams to communicate, collaborate, and manage projects in real-time. Built with Spring Boot backend, React frontend, and packaged as a desktop application with Electron.

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login
- Secure session management with JWT tokens
- User profiles and account management

### 🏢 Workspace Management
- Create and manage multiple workspaces
- Role-based access control (Owner/Member)
- Invite and manage workspace members
- Workspace-specific permissions

### 💬 Real-Time Communication
- **Channels**: Organize conversations by topic
- **Messages**: Send and receive messages in real-time
- **WebSocket Integration**: Instant message delivery using STOMP protocol
- Message history and threading

### 📢 Announcements
- Create workspace-wide announcements
- Real-time announcement broadcasting
- Announcement history and management

### 📋 Task Management
- Create and assign tasks/assignments
- Set due dates and descriptions
- Track assignment progress
- Assignment notifications

### 📁 File Management
- Upload and share files
- Associate files with messages or assignments
- File metadata tracking

### 🖥️ Desktop Application
- Cross-platform desktop app built with Electron
- Native desktop experience
- Offline-ready interface

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot 4.0.3
- **Language**: Java 17
- **Database**: PostgreSQL (with H2 for testing)
- **ORM**: Spring Data JPA with Hibernate
- **Real-Time**: Spring WebSocket with STOMP
- **Build Tool**: Gradle
- **API**: RESTful endpoints with DTOs

### Frontend (React)
- **Framework**: React 19.2.4
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **WebSocket**: STOMP.js and SockJS
- **Build Tool**: Create React App
- **Styling**: CSS Modules

### Desktop (Electron)
- **Framework**: Electron 41.1.1
- **Packaging**: Electron Builder
- **Main Process**: Custom Electron main script

## 📊 Database Schema

### Core Tables
- `users` - User accounts and profiles
- `workspaces` - Workspace containers with ownership
- `workspace_members` - User-workspace relationships with roles
- `channels` - Communication channels within workspaces
- `messages` - Channel messages with real-time delivery
- `announcements` - Workspace announcements
- `assignments` - Tasks and assignments
- `files` - File attachments and metadata

## 🚀 Getting Started

### Prerequisites
- **Java 17** or higher
- **Node.js 16+** and npm
- **PostgreSQL** (or H2 for development)
- **Gradle** (or use included wrapper)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd devworkspace
   ```

2. **Configure Database**
   - Update `src/main/resources/application.properties` with your PostgreSQL credentials
   - Or use H2 (in-memory) for development

3. **Run the Backend**
   ```bash
   # Using Gradle wrapper
   ./gradlew bootRun
   ```
   The API will be available at `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   The React app will run at `http://localhost:3000`

### Desktop Application

1. **Build the React app**
   ```bash
   cd frontend
   npm run build
   ```

2. **Run Electron app**
   ```bash
   npm run electron
   ```

3. **Package for distribution**
   ```bash
   npm run electron-pack
   ```

## 🔧 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### Workspaces
- `GET /workspaces` - List all workspaces
- `POST /workspaces` - Create workspace
- `GET /workspaces/{id}` - Get workspace details
- `DELETE /workspaces/{id}` - Delete workspace (owner only)

### Channels
- `GET /channels/workspace/{workspaceId}` - List workspace channels
- `POST /channels/workspace/{workspaceId}` - Create channel (owner only)

### Messages
- `GET /messages/channel/{channelId}` - Get channel messages
- `POST /messages/channel/{channelId}` - Send message

### And more... (see full API documentation)

## 🔄 Real-Time Features

The application uses WebSocket connections for real-time updates:

- **Message Broadcasting**: New messages appear instantly
- **Channel Updates**: Real-time channel creation/deletion
- **Member Changes**: Live member list updates
- **Announcements**: Instant announcement delivery
- **Assignment Updates**: Real-time task notifications

## 🛠️ Development

### Project Structure
```
devworkspace/
├── src/main/java/com/example/devworkspace/  # Backend source
│   ├── controller/     # REST API endpoints
│   ├── service/        # Business logic
│   ├── entity/         # JPA entities
│   ├── repository/     # Data access
│   ├── dto/           # Data transfer objects
│   └── configuration/ # Spring configuration
├── frontend/          # React application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   └── App.js      # Main app component
│   ├── public/         # Static assets
│   └── main.js         # Electron main process
├── sql scripts/       # Database schema
└── build.gradle       # Build configuration
```

### Available Scripts

**Backend:**
- `./gradlew build` - Build the application
- `./gradlew bootRun` - Run development server
- `./gradlew test` - Run tests

**Frontend:**
- `npm start` - Start React development server
- `npm run build` - Create production build
- `npm run electron` - Run Electron app
- `npm run electron-pack` - Package for distribution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

---

**DevWorkspace** - Bringing teams together with modern collaboration tools.

1. **Clone the repository**

```bash
git clone https://github.com/<your-username>/devworkspace.git
cd devworkspace
```

2. **Build and run the project**

```bash
mvn spring-boot:run
```

3. **Access the API**

```bash
Base URL: http://localhost:8080
```

**API Endpoints**
| Resource       | Method | Endpoint                                                             | Request Params / Body                   | Permissions / Notes                |
| -------------- | ------ | -------------------------------------------------------------------- | --------------------------------------- | ---------------------------------- |
| **Users**      | POST   | `/api/users/register`                                                | Body: `{ "name", "email", "password" }` | Anyone                             |
|                | POST   | `/api/users/login`                                                   | Body: `{ "email", "password" }`         | Anyone                             |
|                | GET    | `/api/users`                                                         | -                                       | Admin / All users (optional)       |
| **Workspaces** | POST   | `/workspaces`                                                        | Body: `{ "name" }`                      | Only logged-in user; becomes owner |
|                | GET    | `/workspaces`                                                        | -                                       | All logged-in users                |
|                | GET    | `/workspaces/{id}/members`                                           | -                                       | Only workspace members             |
|                | POST   | `/workspaces/{id}/members?requesterId={userId}`                      | Body: `{ "userId", "role" }`            | Only owner                         |
|                | DELETE | `/workspaces/{id}/members/{memberId}?requesterId={userId}`           | -                                       | Only owner                         |
| **Channels**   | POST   | `/channels/workspace/{workspaceId}?requesterId={userId}&name={name}` | -                                       | Only workspace owner               |
|                | GET    | `/channels/workspace/{workspaceId}`                                  | -                                       | Workspace members                  |
|                | DELETE | `/channels/{channelId}?requesterId={userId}`                         | -                                       | Only workspace owner               |
| **Messages**   | POST   | `/messages/channel/{channelId}?senderId={userId}&content={text}`     | -                                       | Workspace members                  |
|                | GET    | `/messages/channel/{channelId}`                                      | -                                       | Workspace members                  |
|                | DELETE | `/messages/{messageId}?requesterId={userId}`                         | -                                       | Only sender can delete             |


### Example API Endpoints

#### Users

POST /api/users/register
POST /api/users/login
GET /api/users


#### Workspaces

POST /workspaces # create workspace
GET /workspaces # list workspaces
GET /workspaces/{id}/members # list workspace members
POST /workspaces/{id}/members # add member
DELETE /workspaces/{id}/members/{memberId} # remove member


#### Channels

POST /channels/workspace/{workspaceId}?requesterId=1&name=general
GET /channels/workspace/{workspaceId}
DELETE /channels/{channelId}?requesterId=1


#### Messages

POST /messages/channel/{channelId}?senderId=2&content=Hello
GET /messages/channel/{channelId}
DELETE /messages/{messageId}?requesterId=2 # delete own message


## How to Run
1. Clone the repository
2. Configure `application.properties` for your database
3. Run the Spring Boot application
4. Use Postman or frontend to interact with APIs

## Notes
- Only workspace owners can create channels or manage members
- Members can send messages and delete their own messages
- Deleting a workspace or channel cascades to delete associated members, channels, and messages


## License

This project is licensed under the **MIT License**.  
