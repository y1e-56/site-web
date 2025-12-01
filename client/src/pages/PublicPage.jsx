import TicketForm from '../components/TicketForm.jsx';

const highlightCards = [
  {
    title: 'Grillades + Drinks',
    detail: 'Open bar & food jusqu’à l’aube. Tu payes, tu profites en illimité.'
  },
  {
    title: 'Ambiance Purple Touch',
    detail: 'Dress code “Euphoria purple” pour briller sous les néons photos.'
  },
  {
    title: 'Line-up secret',
    detail: 'DJs afro, amapiano & RnB + showcases surprises toute la nuit.'
  }
];

const steps = [
  {
    label: '1. Tu payes via MoMo/OM',
    detail: 'Garde bien la référence de transaction.'
  },
  {
    label: '2. Tu remplis le formulaire',
    detail: 'Infos perso + canal préféré (WhatsApp, SMS ou mail).'
  },
  {
    label: '3. On confirme',
    detail: 'L’équipe vérifie ton paiement en quelques minutes.'
  },
  {
    label: '4. QR unique reçu',
    detail: 'Aucun QR ne passe deux fois. Tu es ready pour le 29 décembre.'
  }
];

const artists = [
  { name: 'DJ Legend', tag: 'Afro / Amapiano', time: '23h00' },
  { name: 'Kezy Flame', tag: 'Live showcase', time: '00h30' },
  { name: 'MOVA Sound', tag: 'RnB + Trap soul', time: '02h00' },
  { name: 'Secret Guest', tag: 'Closing surprise', time: '03h00' }
];

const addOns = [
  'Photobooth néon + impression illimitée',
  'Corner shisha & mocktails signatures',
  'Espace VIP "purple lounge" pour les packs tables',
  'Aftermovie exclusif envoyé à tous les guests'
];

export default function PublicPage() {
  return (
    <section className="page">
      <header className="hero-split">
        {/* Côté gauche - Visuel avec neon text */}
        <div className="hero-visual">
          <div className="visual-container">
            <div className="glow-orb orb-one" />
            <div className="glow-orb orb-two" />
            <div className="neon-text">
              <span className="neon-one">One</span>
              <span className="neon-main">Life.</span>
            </div>
            <div className="visual-overlay"></div>
          </div>
        </div>

        {/* Côté droit - Contenu texte */}
        <div className="hero-content">
          <div className="content-wrapper">
          <p className="eyebrow">Bonapriso • 29 décembre 2025</p>
          <h1 className="gradient-text">ONE Life Experience</h1>
          <p className="hero-lead">
            Une nuit ultra-select avec grillades & boissons à volonté, vibes
            afro-amapiano et dress code “Euphoria purple touch”. Réserve ton QR
            avant que la guest-list ne soit full.
          </p>
          <div className="hero-cta">
            <a className="primary cta" href="#ticket-form">
              Réserver maintenant
            </a>
            <span className="dresscode-tag">Dress code : purple touch</span>
          </div>
          <div className="hero-stats">
            <div>
              <span>🔥</span>
              Grillades & drinks à volonté
            </div>
            <div>
              <span>🎧</span>
              DJs & showcases surprises
            </div>
            <div>
              <span>🛡️</span>
              QR unique + contrôle express
            </div>
          </div>
        </div>
        <div className="hero-right">
          <div className="countdown-card">
            <p className="label">Save the date</p>
            <p className="date">29 • DEC • 2025</p>
            <p className="location">Bonapriso, Douala</p>
          </div>
          <div className="perks-card">
            <p>Inclus dans ton pass :</p>
            <ul>
              <li>✨ Grillades premium</li>
              <li>✨ Boissons signature</li>
              <li>✨ Photobooth néon</li>
              <li>✨ Lounge réservé</li>
            </ul>
          </div>
        </div>
      </div>
      </header>

      <section className="highlight-grid">
        {highlightCards.map((card) => (
          <article key={card.title} className="highlight-card neon-card">
            <h3>{card.title}</h3>
            <p>{card.detail}</p>
          </article>
        ))}
      </section>

      <section className="timeline-card neon-card">
        <h3>Comment ça marche ?</h3>
        <ol className="timeline-list">
          {steps.map((step) => (
            <li key={step.label}>
              <strong>{step.label}</strong>
              <span>{step.detail}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="lineup neon-card">
        <div className="lineup-header">
          <div>
            <p className="eyebrow">Line-up & ambiances</p>
            <h3>Qui va retourner la salle ?</h3>
          </div>
          <span className="pill gradient-text">4 DJs + 2 live acts</span>
        </div>
        <div className="lineup-grid">
          {artists.map((artist) => (
            <article key={artist.name} className="artist-card">
              <div>
                <h4>{artist.name}</h4>
                <p>{artist.tag}</p>
              </div>
              <span>{artist.time}</span>
            </article>
          ))}
        </div>
        <ul className="addon-list">
          {addOns.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="vibe-marquee">
        <div className="marquee-track">
          {Array.from({ length: 4 }).map((_, index) => (
            <span key={index}>
              Limited seats • QR unique • Purple touch • ONE Life Experience
            </span>
          ))}
        </div>
      </div>

      <section className="form-section neon-card" id="ticket-form">
        <h3>Prêt à réserver ?</h3>
        <p className="muted">
          Complète le formulaire après ton paiement. On sécurise ta place et on
          t’envoie ton QR unique sur ton canal préféré.
        </p>
        <TicketForm formId="ticket-form" />
      </section>

      <section className="cta-banner neon-card">
        <div>
          <p className="eyebrow">Dernières places</p>
          <h3>Guest-list limitée. Réserve ton QR dès maintenant.</h3>
        </div>
        <div className="cta-actions">
          <a className="primary cta" href="#ticket-form">
            Je prends mon pass
          </a>
          <span className="badge-limited">Contrôle à l’entrée par scan unique</span>
        </div>
      </section>
    </section>
  );
}

