import axios from "axios";

const API_URL = "http://localhost:8080/messages";

const getMessages = async (channelId) => {
  const response = await axios.get(`${API_URL}/channel/${channelId}`);
  return response.data;
};

const sendMessage = async (channelId, senderId, content) => {
  const response = await axios.post(
    `${API_URL}/channel/${channelId}`,
    { content },
    { params: { senderId } }
  );
  return response.data;
};

const deleteMessage = async (messageId, requesterId) => {
  const response = await axios.delete(`${API_URL}/${messageId}`, {
    params: { requesterId },
  });
  return response.data;
};

const messageService = {
  getMessages,
  sendMessage,
  deleteMessage,
};

export default messageService;
