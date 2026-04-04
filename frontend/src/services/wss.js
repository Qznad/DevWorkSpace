import axios from "axios";

const API_URL = "http://localhost:8080/workspaces";

const getUserWorkspaces = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`);
    return response.data; // array of workspaces
  } catch (error) {
    console.error("Error fetching user workspaces:", error);
    return [];
  }
};

const createWorkspace = async (ownerId, name) => {
  try {
    const response = await axios.post(`${API_URL}/create`, null, {
      params: { ownerId, name },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating workspace:", error);
    throw error;
  }
};

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