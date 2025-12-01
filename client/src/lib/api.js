import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('onelife_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestion des erreurs globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Erreur 401 - Non autorisé
    if (error.response?.status === 401) {
      localStorage.removeItem('onelife_token');
      // Rediriger vers login seulement si on n'est pas déjà sur la page de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Erreur de connexion réseau
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      error.userMessage = 'Le serveur n\'est pas accessible. Vérifiez qu\'il est démarré sur le port 5000.';
    }
    
    // Erreur 409 - Conflit
    if (error.response?.status === 409) {
      error.userMessage = error.response.data?.message || 'Cette référence de paiement existe déjà.';
    }
    
    return Promise.reject(error);
  }
);

export default api;

