import axios from "axios";

const API_URL = "http://localhost:8080/announcements";

const getAllAnnouncements = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createAnnouncement = async (announcement) => {
  const response = await axios.post(API_URL, announcement);
  return response.data;
};

const deleteAnnouncement = async (announcementId, userId) => {
  const response = await axios.delete(`${API_URL}/${announcementId}`, {
    params: { userId },
  });
  return response.data;
};

const announcementService = {
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
};

export default announcementService;
