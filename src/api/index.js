import axios from 'axios';
import { API_BASE_URL } from '@/config/index.js';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export default api;