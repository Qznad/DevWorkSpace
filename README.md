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
| Method   | Endpoint                                                                      | Description                     |
| -------- | ----------------------------------------------------------------------------- | ------------------------------- |
| `GET`    | `/workspace-members/workspace/{id}/members`                                   | List all members of a workspace |
| `POST`   | `/workspace-members?requesterId={id}`                                         | Add a member (owner-only)       |
| `DELETE` | `/workspace-members/workspace/{workspaceId}/member/{userId}?requesterId={id}` | Remove a member (owner-only)    |
| `GET`    | `/workspace-members`                                                          | List all workspace members      |


****Example Requests****
***Add Member (POST)***
``` http
POST /workspace-members?requesterId=1
Content-Type: application/json

{
  "user": {
    "id": 3,
    "name": "Yassine",
    "email": "yassine@test.com"
  },
  "workspace": {
    "id": 1
  },
  "role": "member"
}
```
Expected Response (if requester is owner)
```json
"New member added to workspace"
```
Expected Response (if requester is not owner)
```json
{
  "error": "Only owner can add members"
}
```
***Remove Member (DELETE)***
``` http
DELETE /workspace-members/workspace/1/member/3?requesterId=1
```
Expected Response
```json
"Member removed successfully"
```
***List Members (GET)***
``` http
GET /workspace-members/workspace/1/members
```
Response:
```json
[
  {
    "userName": "Alice",
    "userEmail": "alice@example.com",
    "role": "owner",
    "workspaceName": "Team Alpha"
  },
  {
    "userName": "Yassine",
    "userEmail": "yassine@test.com",
    "role": "member",
    "workspaceName": "Team Alpha"
  }
]
```
4. **Testing**
You can test all endpoints using:
- *Postman* or *Insomnia*
- *Automated JUnit* + *Spring Boot tests*


## License

This project is licensed under the **MIT License**.  
