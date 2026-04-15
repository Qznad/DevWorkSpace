import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

const getAllUsers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const userService = {
  getAllUsers,
};

export default userService;
