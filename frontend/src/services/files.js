import axios from "axios";

const API_URL = "http://localhost:8080/api/files";

const getAllFiles = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const getFilesByMessage = async (messageId) => {
  const response = await axios.get(`${API_URL}/message/${messageId}`);
  return response.data;
};

const getFilesByAssignment = async (assignmentId) => {
  const response = await axios.get(`${API_URL}/assignment/${assignmentId}`);
  return response.data;
};

const uploadFile = async (file) => {
  const response = await axios.post(API_URL, file);
  return response.data;
};

const deleteFile = async (fileId) => {
  const response = await axios.delete(`${API_URL}/${fileId}`);
  return response.data;
};

const fileService = {
  getAllFiles,
  getFilesByMessage,
  getFilesByAssignment,
  uploadFile,
  deleteFile,
};

export default fileService;
