import axios from "axios";

const API_URL = "http://localhost:8080/workspaces";

// Get workspace members
const getWorkspaceMembers = async (workspaceId) => {
  try {
    const response = await axios.get(`${API_URL}/${workspaceId}/members`);
    return response.data;
  } catch (err) {
    console.error("Error fetching members:", err.response?.data || err.message);
    return [];
  }
};

// Add member to workspace
const addMember = async (workspaceId, requesterId, memberEmail, role = "member") => {
  try {
    const response = await axios.post(
      `${API_URL}/${workspaceId}/members`,
      { requesterId, email: memberEmail, role },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (err) {
    console.error("Error adding member:", err.response?.data || err.message);
    throw err;
  }
};

// Remove member
const removeMember = async (workspaceId, memberUserId, requesterId) => {
  try {
    await axios.delete(
      `${API_URL}/${workspaceId}/members/${memberUserId}`,
      { params: { requesterId } }
    );
  } catch (err) {
    console.error("Error removing member:", err.response?.data || err.message);
    throw err;
  }
};

// Named export to satisfy ESLint
const memberService = { getWorkspaceMembers, addMember, removeMember };

export default memberService;