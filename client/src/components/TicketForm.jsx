import { useState } from 'react';
import api from '../lib/api.js';

const initialForm = {
  fullName: '',
  email: '',
  phoneNumber: '',
  whatsappNumber: '',
  quantity: 1,
  amount: 0,
  paymentMethod: 'orange-money',
  paymentReference: '',
  preferredChannel: 'whatsapp',
  channelAddress: ''
};

const fieldLabels = {
  fullName: 'Nom complet',
  email: 'Email',
  phoneNumber: 'Numéro de téléphone',
  whatsappNumber: 'Numéro WhatsApp',
  quantity: 'Nombre de billets',
  amount: 'Montant payé (FCFA)',
  paymentMethod: 'Mode de paiement',
  paymentReference: 'Référence de transaction',
  preferredChannel: 'Canal de réception',
  channelAddress: 'Identifiant du canal'
};

const channelPlaceholders = {
  whatsapp: 'Ex: +22507000000',
  sms: 'Numéro de téléphone',
  email: 'Adresse email',
  instagram: 'Nom d\'utilisateur Instagram (ex: @username)',
  snapchat: 'Nom d\'utilisateur Snapchat (ex: username)'
};

export default function TicketForm({ formId = 'ticket-form' }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });
    try {
      await api.post('/public/tickets', form);
      setStatus({
        type: 'success',
        message:
          'Merci ! Ton paiement sera vérifié rapidement. Tu recevras ton QR code dès confirmation.'
      });
      setForm(initialForm);
    } catch (error) {
      let message = 'Une erreur est survenue';
      
      if (error.userMessage) {
        message = error.userMessage;
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        message = 'Le serveur n\'est pas accessible. Vérifiez votre connexion ou contactez le support.';
      } else if (error.response?.status === 409) {
        message = 'Cette référence de paiement existe déjà. Vérifiez que vous n\'avez pas déjà soumis cette demande.';
      } else if (error.response?.status === 400) {
        message = 'Données invalides. Vérifiez tous les champs requis.';
      }
      
      setStatus({ type: 'error', message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="card" id={formId} onSubmit={handleSubmit}>
      <h2>Billetterie ONE Life</h2>
      <p className="muted">
        Remplis ce formulaire après ton paiement Mobile Money. Nous confirmons
        manuellement chaque transaction pour garantir la sécurité.
      </p>

      <div className="form-grid">
        <label>
          {fieldLabels.fullName}
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          {fieldLabels.phoneNumber}
          <input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          {fieldLabels.email}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </label>

        <label>
          {fieldLabels.whatsappNumber}
          <input
            name="whatsappNumber"
            value={form.whatsappNumber}
            onChange={handleChange}
          />
        </label>

        <label>
          {fieldLabels.quantity}
          <input
            type="number"
            name="quantity"
            min="1"
            value={form.quantity}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          {fieldLabels.amount}
          <input
            type="number"
            name="amount"
            min="0"
            step="500"
            value={form.amount}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="payment-options">
        <p>{fieldLabels.paymentMethod}</p>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="orange-money"
            checked={form.paymentMethod === 'orange-money'}
            onChange={handleChange}
          />
          Orange Money
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="mtn-money"
            checked={form.paymentMethod === 'mtn-money'}
            onChange={handleChange}
          />
          MTN Mobile Money
        </label>
      </div>

      <label>
        {fieldLabels.paymentReference}
        <input
          name="paymentReference"
          value={form.paymentReference}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        {fieldLabels.preferredChannel}
        <select
          name="preferredChannel"
          value={form.preferredChannel}
          onChange={handleChange}
        >
          <option value="whatsapp">WhatsApp</option>
          <option value="instagram">Instagram</option>
          <option value="snapchat">Snapchat</option>
          <option value="sms">SMS</option>
          <option value="email">Email</option>
        </select>
      </label>

      <label>
        {fieldLabels.channelAddress}
        <input
          name="channelAddress"
          placeholder={channelPlaceholders[form.preferredChannel]}
          value={form.channelAddress}
          onChange={handleChange}
          required
        />
      </label>

      {status.message && (
        <div className={`alert ${status.type}`}>{status.message}</div>
      )}

      <button className="primary" type="submit" disabled={loading}>
        {loading ? 'Envoi...' : 'Soumettre ma demande'}
      </button>
    </form>
  );
}

