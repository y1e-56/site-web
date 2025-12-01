import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/admin/login', { email, password });
      
      if (!data.token || !data.admin) {
        throw new Error('Réponse serveur invalide');
      }
      
      localStorage.setItem('onelife_token', data.token);
      localStorage.setItem('onelife_role', data.admin.role || 'admin');
      localStorage.setItem('onelife_user_id', data.admin.id);
      localStorage.setItem('onelife_user_email', data.admin.email);
      
      const role = data.admin.role || 'admin';
      if (role === 'scanner') {
        navigate('/scanner', { replace: true });
      } else {
        navigate('/admin', { replace: true });
      }
    } catch (err) {
      let message = 'Connexion impossible';
      
      if (err.userMessage) {
        message = err.userMessage;
      } else if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        message = 'Le serveur n\'est pas accessible. Assurez-vous que le serveur est démarré sur le port 5000.';
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.status === 401) {
        message = 'Email ou mot de passe incorrect';
      }
      
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page narrow">
      <form className="card hover-lift" onSubmit={handleSubmit}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '0.5rem',
            background: 'linear-gradient(135deg, #6366f1, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '800'
          }}>
            🔐 Espace Admin
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem' }}>
            Gestion des tickets et administrateurs
          </p>
        </div>
        
        <label>
          <span style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            style={{
              borderColor: email ? 'rgba(99, 102, 241, 0.5)' : undefined
            }}
          />
        </label>
        
        <label>
          <span style={{ fontWeight: '600', marginBottom: '0.5rem' }}>Mot de passe</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            style={{
              borderColor: password ? 'rgba(99, 102, 241, 0.5)' : undefined
            }}
          />
        </label>
        
        {error && (
          <div className="alert error" style={{
            animation: 'slideInLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
          }}>
            <span>⚠️</span>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          className="primary"
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '1rem',
            fontSize: '1rem',
            padding: '1rem',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ animation: 'spin 1s linear infinite' }}>⏳</span>
              Connexion en cours...
            </span>
          ) : (
            '✨ Se connecter'
          )}
        </button>
      </form>
    </section>
  );
}

