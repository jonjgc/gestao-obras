import axios from 'axios';
import { parseCookies } from 'nookies';

export const api = axios.create({
  baseURL: 'http://localhost:8080',
});

// Interceptor para injetar o token em todos os pedidos
api.interceptors.request.use((config) => {
  const { 'gestaoobras.token': token } = parseCookies();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});