export default function AdminTicketTable({
  tickets,
  onConfirm,
  onMarkSent,
  loadingIds
}) {
  const downloadQR = (ticket) => {
    if (!ticket.qrImage) {
      alert('QR code non disponible');
      return;
    }
    
    // Créer un lien de téléchargement
    const link = document.createElement('a');
    link.href = ticket.qrImage;
    link.download = `ONE-Life-${ticket.fullName.replace(/\s+/g, '-')}-${ticket._id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!tickets.length) {
    return <p className="muted">Aucun ticket pour le moment.</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Contact</th>
            <th>Paiement</th>
            <th>Canal</th>
            <th>Status</th>
            <th>QR Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket._id}>
              <td>
                <strong>{ticket.fullName}</strong>
                <div className="muted small">{ticket.quantity} billet(s)</div>
              </td>
              <td>
                {ticket.phoneNumber}
                <div className="small">{ticket.email}</div>
              </td>
              <td>
                {ticket.paymentMethod} <br />
                <span className="small">{ticket.paymentReference}</span>
              </td>
              <td>
                <div className="small text-upper">{ticket.preferredChannel}</div>
                <div>{ticket.channelAddress}</div>
              </td>
              <td>
                <span className={`badge ${ticket.status}`}>
                  {ticket.status}
                </span>
              </td>
              <td>
                {ticket.qrImage ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <img 
                      src={ticket.qrImage} 
                      alt="QR Code" 
                      style={{ 
                        width: '80px', 
                        height: '80px', 
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }} 
                    />
                    <button
                      onClick={() => downloadQR(ticket)}
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    >
                      Télécharger
                    </button>
                  </div>
                ) : (
                  <span className="muted small">Non généré</span>
                )}
              </td>
              <td className="table-actions">
                {ticket.status === 'pending' && (
                  <button
                    onClick={() => onConfirm(ticket._id)}
                    disabled={loadingIds.includes(ticket._id)}
                  >
                    Confirmer & Générer QR
                  </button>
                )}
                {ticket.status === 'confirmed' && (
                  <button
                    className="ghost"
                    onClick={() => onMarkSent(ticket._id)}
                    disabled={loadingIds.includes(ticket._id)}
                  >
                    Marquer comme envoyé
                  </button>
                )}
                {ticket.status === 'sent' && (
                  <span className="muted small">Envoyé</span>
                )}
                {ticket.status === 'checked_in' && <span>Entrée validée</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

