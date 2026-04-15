import axios from "axios";

const API_URL = "http://localhost:8080/workspaces";

const getUserWorkspaces = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/userworkspaces/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user workspaces:", error);
    return [];
  }
};

const getWorkspace = async (workspaceId) => {
  try {
    const response = await axios.get(`${API_URL}/${workspaceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching workspace:", error);
    throw error;
  }
};

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
  getWorkspace,
  createWorkspace,
  deleteWorkspace,
};

export default workspaceService;
