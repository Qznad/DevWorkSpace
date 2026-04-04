import axios from "axios";

// Base URL of your Spring Boot backend
const API = axios.create({
  baseURL: "http://localhost:8080/api",
});
export const getUserWorkspaces = async (userId) => {
  const res = await API.get(`/workspaces/user/${userId}`);
  return res.data;
};


export default API;