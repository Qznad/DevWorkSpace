import axios from "axios";

const API_URL = "http://localhost:8080/assignments";

const getWorkspaceAssignments = async (workspaceId) => {
  const response = await axios.get(`${API_URL}/workspace/${workspaceId}`);
  return response.data;
};

const createAssignment = async (assignment) => {
  const response = await axios.post(API_URL, assignment);
  return response.data;
};

const deleteAssignment = async (assignmentId, userId) => {
  const response = await axios.delete(`${API_URL}/${assignmentId}`, {
    params: { userId },
  });
  return response.data;
};

const assignmentService = {
  getWorkspaceAssignments,
  createAssignment,
  deleteAssignment,
};

export default assignmentService;
