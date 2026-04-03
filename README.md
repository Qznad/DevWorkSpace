#  DevWorkspace - Workspace Member Management

[![Java](https://img.shields.io/badge/Java-17-blue)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0.0-green)](https://spring.io/projects/spring-boot)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

DevWorkspace is a **Spring Boot application** for managing workspaces and their members.  
It allows workspace owners to add/remove members, assign roles, and view workspace member lists.  

---

##  Features

- Create and manage workspaces
- Add members to a workspace (owner-only permission)
- Remove members from a workspace (owner-only permission)
- List all members in a workspace
- Clean JSON responses using **DTOs**
- Role-based checks to ensure only owners can modify members

---

##  Technology Stack

- **Backend:** Java 17, Spring Boot 3
- **Database:** H2 (in-memory for testing) / PostgreSQL or MySQL (optional for production)
- **ORM:** Spring Data JPA (Hibernate)
- **Build Tool:** Maven
- **API:** RESTful endpoints

---

##  Database Schema

Tables:

- `users`: stores user accounts
- `workspaces`: stores workspace info, links to owner
- `workspace_members`: maps users to workspaces with roles (`owner` or `member`)  

**Relationships:**

- `Workspace` → `User` (owner) → One-to-One
- `WorkspaceMember` → `User` & `Workspace` → Many-to-One
- Unique constraint on `(user_id, workspace_id)` in `workspace_members`  

---

##  Getting Started

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



# DevWorkSpace

A collaborative workspace application built with **Spring Boot** (Java) for backend. Supports users, workspaces, channels, messages, and file management.

## Features

### Users
- Register and login
- View all users
- Manage workspaces

### Workspaces
- Create and manage workspaces (owner-only)
- Add or remove members (owner-only)
- Workspace members have roles: `owner` or `member`

### Channels
- Create channels inside a workspace (owner-only)
- Delete channels (owner-only)
- List all channels in a workspace

### Messages
- Send messages in a channel (all members)
- Delete own messages
- Messages are tied to channels and users

### Database Structure
- PostgreSQL database with the following tables:
  - `users`
  - `workspaces`
  - `workspace_members`
  - `channels`
  - `messages`
  - `assignments`
  - `files`
  - `announcements`

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

4. **Testing**
You can test all endpoints using:
- *Postman* or *Insomnia*
- *Automated JUnit* + *Spring Boot tests*


## License

This project is licensed under the **MIT License**.  
