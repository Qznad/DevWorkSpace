import axios from "axios";

const API_URL = "http://localhost:8080/channels";

const getChannels = async (workspaceId) => {
  try {
    const response = await axios.get(`${API_URL}/workspace/${workspaceId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching channels:", error);
    return [];
  }
};

const createChannel = async (workspaceId, requesterId, name) => {
  try {
    const response = await axios.post(
      `${API_URL}/workspace/${workspaceId}`,
      { name },
      { params: { requesterId } }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating channel:", error);
    throw error;
  }
};

const deleteChannel = async (channelId, requesterId) => {
  try {
    await axios.delete(`${API_URL}/${channelId}`, {
      params: { requesterId },
    });
  } catch (error) {
    console.error("Error deleting channel:", error);
    throw error;
  }
};

const channelService = {
  getChannels,
  createChannel,
  deleteChannel,
};

export default channelService;
