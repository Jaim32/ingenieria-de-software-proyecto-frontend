// src/api/apiDaily.js
import axios from 'axios';

export default {
  configure(token) {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  },
  /** 
   * GET /api/daily/snapshot?usuarioId=...&fecha=YYYY-MM-DD 
   * Si fecha es hoy o null devuelve datos “en vivo”,  
   * si es pasada devuelve el JSON archivado.
   */
  getSnapshot(usuarioId, fecha) {
    const params = { usuarioId };
    if (fecha) params.fecha = fecha;
    return axios.get('/api/daily/snapshot', { params });
  }
};
