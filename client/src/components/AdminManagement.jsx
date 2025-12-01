import { useState, useEffect } from 'react';
import api from '../lib/api.js';

export default function AdminManagement() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', displayName: '', role: 'admin' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/admins');
      setAdmins(data);
    } catch (error) {
      console.error('Erreur lors du chargement des admins:', error);
      setError('Erreur lors du chargement des administrateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      await api.post('/admin/admins', formData);
      setSuccess('Administrateur créé avec succès');
      setFormData({ email: '', password: '', displayName: '', role: 'admin' });
      setShowAddForm(false);
      fetchAdmins();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la création');
    }
  };

  const handleDeleteAdmin = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      return;
    }
    
    try {
      await api.delete(`/admin/admins/${id}`);
      setSuccess('Administrateur supprimé avec succès');
      fetchAdmins();
    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>👥 Gestion des Utilisateurs</h2>
        <button
          className="primary"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Annuler' : '+ Ajouter un utilisateur'}
        </button>
      </div>

      {error && (
        <div className="alert error" style={{ marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="alert success" style={{ marginBottom: '1rem' }}>
          {success}
        </div>
      )}

      {showAddForm && (
        <form onSubmit={handleAddAdmin} style={{ 
          background: '#f9fafb', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          marginBottom: '1.5rem' 
        }}>
          <h3 style={{ marginTop: 0 }}>Nouvel administrateur</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label>
              Email *
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="admin@example.com"
              />
            </label>
            <label>
              Mot de passe * (min. 6 caractères)
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                placeholder="••••••"
              />
            </label>
            <label>
              Nom d'affichage (optionnel)
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                placeholder="Nom de l'admin"
              />
            </label>
            <label>
              Rôle *
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              >
                <option value="admin">👑 Administrateur (accès complet)</option>
                <option value="scanner">🔍 Scanner (scanner QR uniquement)</option>
              </select>
            </label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button type="submit" className="primary">
                Créer l'utilisateur
              </button>
              <button 
                type="button" 
                className="ghost"
                onClick={() => {
                  setShowAddForm(false);
                  setFormData({ email: '', password: '', displayName: '', role: 'admin' });
                  setError('');
                }}
              >
                Annuler
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Nom d'affichage</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                  <p className="muted">Aucun administrateur</p>
                </td>
              </tr>
            ) : (
              admins.map((admin) => (
                <tr key={admin._id}>
                  <td>
                    <strong>{admin.email}</strong>
                  </td>
                  <td>
                {admin.displayName || '-'}
                <div className="small">
                  <span className={`badge ${admin.role === 'admin' ? 'admin' : 'scanner'}`}>
                    {admin.role === 'admin' ? '👑 Admin' : '🔍 Scanner'}
                  </span>
                </div>
              </td>
                  <td className="small">
                    {new Date(admin.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td>
                    <button
                      className="ghost"
                      onClick={() => handleDeleteAdmin(admin._id)}
                      style={{ color: '#ef4444' }}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: '#f3f4f6',
        borderRadius: '4px',
        fontSize: '0.9rem'
      }}>
        <strong>💡 Rôles des utilisateurs :</strong><br/>
        <strong>👑 Administrateur :</strong> Accès complet - gestion des tickets, envoi des QR, gestion des utilisateurs<br/>
        <strong>🔍 Scanner :</strong> Accès limité - uniquement scanner les QR codes à l'entrée des événements
      </div>
    </div>
  );
}

