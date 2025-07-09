import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_URL}/user`;
export const loginAdmin = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/admin/login`, credentials);
    return response.data 
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
  }
};