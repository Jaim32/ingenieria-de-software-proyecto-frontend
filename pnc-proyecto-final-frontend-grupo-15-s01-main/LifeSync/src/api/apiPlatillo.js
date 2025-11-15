// src/api/apiPlatillo.js
import axios from 'axios';
export default {
  configure(token) {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  },
  getPlatillosByDate(userId, fecha) {
    return axios.get(`/api/platillos/usuario/${userId}`, { params: { fecha } });
  },
};
