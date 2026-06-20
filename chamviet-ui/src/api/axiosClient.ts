import axios from 'axios';
import { resolveApiOrigin } from "../utils/apiBase";

const API_ORIGIN = resolveApiOrigin(
  import.meta.env.VITE_API_BASE_URL as string | undefined,
);

const axiosClient = axios.create({
  baseURL: `${API_ORIGIN}/api/v1`,
});

export default axiosClient;