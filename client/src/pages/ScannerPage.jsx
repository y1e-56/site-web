import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';

export default function ScannerPage() {
  const navigate = useNavigate();
  const [qrPayload, setQrPayload] = useState('');
  const [search, setSearch] = useState('');
  const [result, setResult] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Vérifier l'authentification
    const token = localStorage.getItem('onelife_token');
    const role = localStorage.getItem('onelife_role');
    
    if (!token) {
      navigate('/scanner-login');
      return;
    }
    
    // Si c'est un admin, on peut rester (il a accès à tout)
    // Si c'est un scanner, c'est bon aussi
    if (role && role !== 'admin' && role !== 'scanner') {
      navigate('/scanner-login');
      return;
    }
    
    // Auto-remplir depuis le presse-papiers si disponible
    if ('clipboard' in navigator) {
      navigator.clipboard.readText().then((text) => {
        if (text.includes('ticketId')) {
          setQrPayload(text);
        }
      });
    }
  }, [navigate]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setQrPayload(text);
      textareaRef.current?.focus();
    } catch (error) {
      console.error('Clipboard error', error);
    }
  };

  const handleValidate = async (event) => {
    event.preventDefault();
    
    // Vérification basique avant envoi
    if (!qrPayload || !qrPayload.trim()) {
      setResult({
        status: 'error',
        message: 'Veuillez coller le contenu du QR code'
      });
      return;
    }
    
    setLoading(true);
    setResult(null);
    try {
      console.log('[SCAN] Envoi du QR:', qrPayload.substring(0, 100) + '...');
      const { data } = await api.post('/scanner/validate', { qrPayload: qrPayload.trim() });
      console.log('[SCAN] Réponse reçue:', data);
      setResult(data);
      setQrPayload('');
    } catch (error) {
      console.error('[SCAN] Erreur complète:', error);
      let message = 'Erreur lors de la validation du QR code';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.status === 401) {
        message = 'Vous devez être connecté pour scanner. Connectez-vous d\'abord.';
      } else if (error.response?.status === 400) {
        message = error.response.data?.message || 'Format QR invalide. Vérifiez que vous avez bien collé tout le contenu JSON.';
      } else if (error.code === 'ERR_NETWORK') {
        message = 'Le serveur n\'est pas accessible. Vérifiez qu\'il est démarré.';
      }
      
      setResult({
        status: 'error',
        message: message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setSearchResult(null);
    try {
      const { data } = await api.get(`/admin/tickets?query=${search.trim()}`);
      setSearchResult(data?.[0] || null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page narrow">
      <header className="page-header">
        <div>
          <p className="eyebrow">Accès 29 décembre</p>
          <h1>Scanner QR</h1>
        </div>
      </header>

      <form className="card" onSubmit={handleValidate}>
        <h3 style={{ marginTop: 0 }}>📱 Comment scanner un QR code :</h3>
        <ol style={{ marginLeft: '1.5rem', lineHeight: '1.8' }}>
          <li>Ouvre l'application <strong>Appareil Photo</strong> de ton téléphone</li>
          <li>Scanne le QR code affiché par le client</li>
          <li>L'appareil photo détecte le QR et affiche un lien - <strong>clique dessus</strong></li>
          <li>Le contenu JSON s'affiche - <strong>copie tout le texte</strong></li>
          <li>Colle le contenu dans le champ ci-dessous</li>
          <li>Clique sur <strong>"Valider"</strong></li>
        </ol>
        
        <div style={{ 
          background: '#f3f4f6', 
          padding: '1rem', 
          borderRadius: '4px', 
          margin: '1rem 0',
          fontSize: '0.9rem'
        }}>
          <strong>💡 Astuce :</strong> Sur certains téléphones, après avoir scanné, 
          tu peux faire un <strong>appui long</strong> sur le texte affiché pour le copier automatiquement.
        </div>

        <label style={{ display: 'block', marginTop: '1rem', marginBottom: '0.5rem', fontWeight: '500' }}>
          Contenu du QR code (JSON) :
        </label>
        <textarea
          rows="6"
          ref={textareaRef}
          value={qrPayload}
          onChange={(e) => setQrPayload(e.target.value)}
          placeholder='Colle ici le contenu du QR code

Exemple de format attendu :
{"ticketId":"507f1f77bcf86cd799439011","name":"Jean Dupont","quantity":2,"issuedAt":"2024-12-29T10:30:00.000Z"}'
          required
          style={{ 
            width: '100%', 
            padding: '0.75rem', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontSize: '0.9rem'
          }}
        />
        <div style={{ 
          marginTop: '0.5rem', 
          fontSize: '0.85rem', 
          color: '#666',
          fontStyle: 'italic'
        }}>
          💡 Le contenu doit être un JSON valide avec les champs : ticketId, name, quantity, issuedAt
        </div>
        <div className="scanner-actions" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="ghost" onClick={handlePaste}>
            📋 Coller depuis le presse-papiers
          </button>
          <button className="primary" disabled={loading} style={{ flex: 1 }}>
            {loading ? '⏳ Vérification...' : '✅ Valider le QR code'}
          </button>
        </div>
      </form>

      <div className="card">
        <p className="muted">
          Pas de QR ? Tape le nom ou la référence paiement pour vérifier
          manuellement.
        </p>
        <div className="search-row">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom, téléphone ou référence"
          />
          <button type="button" onClick={handleSearch} disabled={loading}>
            Chercher
          </button>
        </div>
        {searchResult && (
          <div className="alert success">
            <p>{searchResult.fullName}</p>
            <p className="small">
              {searchResult.paymentReference} • {searchResult.status}
            </p>
          </div>
        )}
      </div>

      {result && (
        <div className={`alert ${result.status === 'ok' ? 'success' : result.status === 'already-scanned' || result.status === 'not-confirmed' ? 'error' : 'error'}`}>
          {result.status === 'ok' && (
            <>
              <p><strong>✅ Entrée validée !</strong></p>
              <p>{result.message || `Ticket valide pour ${result.ticket.fullName}`}</p>
              <p className="small">
                {result.ticket.quantity} billet(s) • {result.ticket.paymentMethod} • Ref: {result.ticket.paymentReference}
              </p>
              <p className="small muted">
                Scanné le {new Date().toLocaleString('fr-FR')}
              </p>
            </>
          )}
          {result.status === 'already-scanned' && (
            <>
              <p><strong>❌ Ticket déjà utilisé !</strong></p>
              <p>{result.message || 'Ce ticket a déjà été scanné et ne peut plus être utilisé.'}</p>
              {result.ticket.lastScanAt && (
                <p className="small muted">
                  Scanné le {new Date(result.ticket.lastScanAt).toLocaleString('fr-FR')}
                </p>
              )}
            </>
          )}
          {result.status === 'not-confirmed' && (
            <>
              <p><strong>⚠️ Ticket non confirmé</strong></p>
              <p>{result.message || 'Ce ticket n\'a pas encore été confirmé par l\'administrateur.'}</p>
            </>
          )}
          {result.status === 'error' && (
            <>
              <p><strong>❌ Erreur</strong></p>
              <p>{result.message || 'Une erreur est survenue lors de la validation.'}</p>
            </>
          )}
        </div>
      )}
    </section>
  );
}

