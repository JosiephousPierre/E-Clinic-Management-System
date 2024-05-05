import axios from "axios";

console.log(import.meta.env.VITE_SERVER_BASE_URL);

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_BASE_URL}/api`,
  withCredentials: true,
});

export default axiosClient;
