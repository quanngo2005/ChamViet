import axios from 'axios';

const axiosClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  // Không set Content-Type ở đây nếu bạn gửi FormData (ảnh)
});

export default axiosClient;