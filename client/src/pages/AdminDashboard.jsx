import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import AdminTicketTable from '../components/AdminTicketTable.jsx';
import AdminManagement from '../components/AdminManagement.jsx';

const filters = [
  { label: 'En attente', value: 'pending' },
  { label: 'Confirmés', value: 'confirmed' },
  { label: 'Envoyés', value: 'sent' },
  { label: 'Entrées', value: 'checked_in' },
  { label: 'Tous', value: '' }
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [actionIds, setActionIds] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('tickets'); // 'tickets' ou 'admins'

  useEffect(() => {
    const token = localStorage.getItem('onelife_token');
    const role = localStorage.getItem('onelife_role');
    
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Seuls les admins peuvent accéder au dashboard
    if (role !== 'admin') {
      navigate('/scanner-login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('onelife_token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      setLoading(true);
      setError('');
      try {
        const query = filter ? `?status=${filter}` : '';
        const { data } = await api.get(`/admin/tickets${query}`);
        setTickets(data);
      } catch (error) {
        // Si 401, le redirect est géré par l'interceptor
        if (error.response?.status !== 401) {
          console.error('Erreur lors du chargement des tickets:', error);
          let message = 'Erreur lors du chargement des tickets';
          
          if (error.userMessage) {
            message = error.userMessage;
          } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            message = 'Le serveur n\'est pas accessible. Vérifiez qu\'il est démarré sur le port 5000.';
          } else if (error.response?.data?.message) {
            message = error.response.data.message;
          }
          
          setError(message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filter, navigate]);

  const updateTicket = (updated) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket._id === updated._id ? updated : ticket))
    );
  };

  const handleConfirm = async (id) => {
    setActionIds((prev) => [...prev, id]);
    try {
      const { data } = await api.post(`/admin/tickets/${id}/confirm`);
      updateTicket(data);
    } catch (error) {
      console.error('Erreur lors de la confirmation:', error);
      alert(error.userMessage || error.response?.data?.message || 'Erreur lors de la confirmation');
    } finally {
      setActionIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleMarkSent = async (id) => {
    setActionIds((prev) => [...prev, id]);
    try {
      const { data } = await api.post(`/admin/tickets/${id}/sent`);
      updateTicket(data);
    } catch (error) {
      console.error('Erreur lors du marquage:', error);
      alert(error.userMessage || error.response?.data?.message || 'Erreur lors du marquage');
    } finally {
      setActionIds((prev) => prev.filter((item) => item !== id));
    }
  };

  // Fonction supprimée - plus d'envoi automatique

  const logout = () => {
    localStorage.removeItem('onelife_token');
    navigate('/login');
  };

  return (
    <section className="page">
      <header className="page-header">
        <div>
          <p className="eyebrow">ONE Life</p>
          <h1>Dashboard Admin</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a 
            href="/scanner" 
            style={{ 
              padding: '0.5rem 1rem', 
              background: '#6366f1', 
              color: 'white', 
              textDecoration: 'none', 
              borderRadius: '4px',
              fontWeight: '500'
            }}
          >
            📱 Scanner QR
          </a>
          <button onClick={logout}>Déconnexion</button>
        </div>
      </header>

      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        borderBottom: '1px solid #e5e7eb',
        paddingBottom: '0.5rem'
      }}>
        <button
          onClick={() => setActiveTab('tickets')}
          className={activeTab === 'tickets' ? 'active' : ''}
          style={{ 
            padding: '0.5rem 1rem',
            background: activeTab === 'tickets' ? '#6366f1' : 'transparent',
            color: activeTab === 'tickets' ? 'white' : 'inherit',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🎫 Tickets
        </button>
        <button
          onClick={() => setActiveTab('admins')}
          className={activeTab === 'admins' ? 'active' : ''}
          style={{ 
            padding: '0.5rem 1rem',
            background: activeTab === 'admins' ? '#6366f1' : 'transparent',
            color: activeTab === 'admins' ? 'white' : 'inherit',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          👥 Administrateurs
        </button>
      </div>

      {activeTab === 'tickets' && (
        <>
          <div className="filters">
            {filters.map((item) => (
              <button
                key={item.value}
                className={filter === item.value ? 'active' : ''}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="alert error" style={{ marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          {loading ? (
            <p>Chargement...</p>
          ) : (
            <AdminTicketTable
              tickets={tickets}
              onConfirm={handleConfirm}
              onMarkSent={handleMarkSent}
              loadingIds={actionIds}
            />
          )}
        </>
      )}

      {activeTab === 'admins' && (
        <AdminManagement />
      )}
    </section>
  );
}

