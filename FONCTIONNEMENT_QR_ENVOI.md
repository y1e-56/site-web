# 📱 Fonctionnement du Système de QR Code et d'Envoi

## 🔄 Flux Complet du Système

### 1️⃣ **Création du Ticket (Client)**
```
Client remplit le formulaire → Ticket créé avec status: "pending"
```

### 2️⃣ **Validation Admin**
Quand l'admin clique sur "Confirmer" :

```
┌─────────────────────────────────────┐
│ 1. Génération du QR Code            │
│    - Création du payload JSON       │
│    - Génération de l'image QR       │
│    - Sauvegarde dans la DB           │
│    Status: "pending" → "confirmed"   │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│ 2. Envoi Automatique du QR          │
│    - Vérification du canal choisi   │
│    - Envoi via le canal préféré     │
│    Status: "confirmed" → "sent"      │
└─────────────────────────────────────┘
```

## 📊 Détails Techniques

### Génération du QR Code

**Fichier:** `server/src/services/ticketService.js`

```javascript
1. buildQrPayload(ticket) 
   → Crée un objet JSON avec:
      - ticketId (ID unique du ticket)
      - name (nom du client)
      - quantity (nombre de billets)
      - issuedAt (date de génération)

2. generateQrImage(payload)
   → Utilise la librairie 'qrcode'
   → Génère une image PNG en base64
   → Retourne: { payload: string, dataUrl: string }

3. Sauvegarde dans MongoDB
   → ticket.qrPayload = JSON stringifié
   → ticket.qrImage = data URL (base64)
```

**Exemple de payload QR:**
```json
{
  "ticketId": "507f1f77bcf86cd799439011",
  "name": "Jean Dupont",
  "quantity": 2,
  "issuedAt": "2024-12-29T10:30:00.000Z"
}
```

### Système d'Envoi

**Fichier:** `server/src/services/deliveryService.js`

Le système supporte maintenant **5 canaux** :

#### 1. **WhatsApp** 📱
- Utilise l'API WhatsApp Business (Graph Facebook)
- Upload l'image QR sur les serveurs Facebook
- Envoie un message avec l'image et une légende
- **Configuration requise:** `WHATSAPP_TOKEN` et `WHATSAPP_PHONE_ID`

#### 2. **Instagram** 📸
- Utilise l'API Instagram Graph (via Facebook)
- Envoie le QR code via Instagram Direct
- **Configuration requise:** Compte Instagram Business connecté
- **Configuration requise:** `WHATSAPP_TOKEN` et `WHATSAPP_PHONE_ID` (même que WhatsApp)

#### 3. **Snapchat** 👻
- Structure prête pour Snapchat Business API
- **Note:** Nécessite une intégration Snapchat Business
- Pour l'instant, fonctionne en mode sandbox (logs uniquement)

#### 4. **Email** 📧
- Utilise SMTP (nodemailer)
- Envoie un email HTML avec l'image QR intégrée
- Pièce jointe: fichier PNG du QR code
- **Configuration requise:** `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`

#### 5. **SMS** 💬
- Structure prête pour passerelle SMS
- **Note:** À implémenter avec un fournisseur SMS

## 🔧 Mode Sandbox

Par défaut, le système est en **mode sandbox** (`DELIVERY_SANDBOX=true`).

En mode sandbox:
- ✅ Le QR code est **généré normalement**
- ✅ Les envois sont **simulés** (logs dans la console)
- ✅ Aucun message réel n'est envoyé
- ✅ Parfait pour tester sans configurer les APIs

Pour activer les envois réels:
```env
DELIVERY_SANDBOX=false
```

## 📝 Logs Détaillés

Le système affiche des logs pour chaque étape:

```
[TICKET] Confirmation du ticket: 507f1f77bcf86cd799439011
[QR] Génération du QR code pour: {"ticketId":"...","name":"..."}
[QR] QR code généré avec succès, taille: 45234 caractères
[TICKET] Ticket confirmé avec succès: 507f1f77bcf86cd799439011
[ADMIN] Tentative d'envoi automatique du QR code...
[DELIVERY] Début de la livraison pour ticket: 507f1f77bcf86cd799439011
[DELIVERY] Canal préféré: whatsapp
[WHATSAPP] Tentative d'envoi pour ticket: 507f1f77bcf86cd799439011
[WHATSAPP] Upload du média...
[WHATSAPP] Média uploadé, ID: abc123xyz
[WHATSAPP] Message envoyé avec succès à: +22507000000
[DELIVERY] Livraison réussie pour ticket: 507f1f77bcf86cd799439011
[ADMIN] ✅ Envoi automatique réussi - QR code envoyé au client
```

## ⚠️ Problèmes Courants

### Le client ne reçoit pas le QR code

**Vérifications:**

1. **Le QR est-il généré?**
   - Vérifiez les logs: `[QR] QR code généré avec succès`
   - Vérifiez dans la DB: `ticket.qrImage` doit exister

2. **L'envoi a-t-il réussi?**
   - Vérifiez les logs: `[DELIVERY] Livraison réussie`
   - Vérifiez le status: doit être `"sent"`
   - Vérifiez `ticket.deliveryLastError` (doit être `undefined`)

3. **Mode sandbox activé?**
   - Si `DELIVERY_SANDBOX=true`, les envois sont simulés
   - Mettez à `false` pour les envois réels

4. **Configuration manquante?**
   - WhatsApp: `WHATSAPP_TOKEN` et `WHATSAPP_PHONE_ID`
   - Email: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
   - Instagram: Même config que WhatsApp + compte Business

5. **Erreur dans les logs?**
   - Cherchez `[DELIVERY] Erreur` ou `❌`
   - Vérifiez `ticket.deliveryLastError` dans la DB

### Le QR n'est pas généré

**Vérifications:**

1. **Le ticket est-il confirmé?**
   - Status doit être `"confirmed"` ou `"sent"`
   - Vérifiez que l'admin a bien cliqué sur "Confirmer"

2. **Erreur de génération?**
   - Vérifiez les logs: `[QR] Erreur lors de la génération`
   - Vérifiez que le package `qrcode` est installé: `npm list qrcode`

3. **Le ticket existe?**
   - Vérifiez dans MongoDB que le ticket existe
   - Vérifiez que `ticket._id` est valide

## 🔄 Réessayer l'Envoi

Si l'envoi échoue, l'admin peut:

1. **Bouton "Envoyer le QR"** (ticket status: "confirmed")
   - Appelle `/admin/tickets/:id/send`
   - Force l'envoi même si déjà tenté

2. **Bouton "Renvoyer"** (ticket status: "sent")
   - Réenvoie le QR code au client
   - Utile si le client n'a pas reçu

## 📋 Checklist de Configuration

Pour que le système fonctionne complètement:

- [ ] MongoDB démarré et connecté
- [ ] Variables d'environnement configurées (`.env`)
- [ ] Mode sandbox désactivé si envois réels (`DELIVERY_SANDBOX=false`)
- [ ] WhatsApp configuré (pour WhatsApp et Instagram)
- [ ] Email SMTP configuré (pour Email)
- [ ] Serveur démarré sur le port 5000
- [ ] Logs vérifiés pour voir les erreurs

## 🎯 Résumé

**Le système fonctionne ainsi:**

1. Client crée un ticket → Status: `pending`
2. Admin confirme → QR généré → Status: `confirmed`
3. Envoi automatique → QR envoyé → Status: `sent`
4. Client reçoit le QR code sur le canal choisi
5. À l'événement, le QR est scanné → Status: `checked_in`

**Tout est automatique après la confirmation admin!** ✅

