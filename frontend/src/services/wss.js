import axios from "axios";

const API_URL = "http://localhost:8080/workspaces";

// Get workspaces for a user
const getUserWorkspaces = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/userworkspaces/${userId}`);
    return response.data; // array of DTOs
  } catch (error) {
    console.error("Error fetching user workspaces:", error);
    return [];
  }
};

// Create a new workspace
const createWorkspace = async (ownerId, name) => {
  try {
    const response = await axios.post(`${API_URL}`, null, {
      params: { ownerId, name },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating workspace:", error);
    throw error;
  }
};

// Delete a workspace (owner only)
const deleteWorkspace = async (workspaceId, userId) => {
  try {
    await axios.delete(`${API_URL}/${workspaceId}`, {
      params: { userId },
    });
  } catch (error) {
    console.error("Error deleting workspace:", error);
    throw error;
  }
};

const workspaceService = {
  getUserWorkspaces,
  createWorkspace,
  deleteWorkspace,
};

export default workspaceService;