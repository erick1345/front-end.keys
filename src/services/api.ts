import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
});

const adminPaths = [
  '/dashboard-admin',
  '/manage-games',
  '/add-game',
  '/edit-game',
];

function isAdminArea(pathname: string) {
  return adminPaths.some((path) => pathname.startsWith(path));
}

api.interceptors.request.use((config) => {
  const pathname = window.location.pathname;
  const token = isAdminArea(pathname)
    ? localStorage.getItem('adminToken')
    : localStorage.getItem('userToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;