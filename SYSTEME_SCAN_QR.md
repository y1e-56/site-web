# 🔍 Système de Scan QR Code - Usage Unique

## 📋 Comment ça fonctionne

### Principe d'Usage Unique

Le système garantit qu'**un QR code ne peut être scanné qu'une seule fois**. Voici comment :

1. **Génération du QR** : Le QR contient un `ticketId` unique
2. **Premier scan** : Le status passe de `confirmed`/`sent` → `checked_in`
3. **Scans suivants** : Le système détecte que le status est déjà `checked_in` et refuse

### 🔄 Flux de Scan

```
┌─────────────────────────────────┐
│ 1. Scan du QR Code              │
│    → Extraction du ticketId     │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│ 2. Vérification du ticket       │
│    - Ticket existe ?            │
│    - Status = "checked_in" ?    │
│      → ❌ Déjà scanné           │
│    - Status = "pending" ?       │
│      → ⚠️ Non confirmé          │
│    - Status = "confirmed/sent" ? │
│      → ✅ Valide                │
└─────────────────────────────────┘
           ↓
┌─────────────────────────────────┐
│ 3. Marquage comme scanné        │
│    - Status → "checked_in"       │
│    - lastScanAt → Date actuelle  │
│    - Sauvegarde en DB           │
└─────────────────────────────────┘
```

## 🛡️ Protection contre la Réutilisation

### Vérifications Effectuées

1. **Ticket existe ?**
   - Si le ticket n'existe pas → Erreur "Ticket introuvable"

2. **Ticket confirmé ?**
   - Si status = `pending` → Erreur "Ticket non confirmé"
   - Seuls les tickets `confirmed` ou `sent` peuvent être scannés

3. **Déjà scanné ?**
   - Si status = `checked_in` → Erreur "Ticket déjà utilisé"
   - Affiche la date du premier scan

4. **Scan valide**
   - Si tout est OK → Status passe à `checked_in`
   - Date de scan enregistrée dans `lastScanAt`

## 📊 États du Ticket

| Status | Signification | Peut être scanné ? |
|--------|---------------|-------------------|
| `pending` | En attente de confirmation | ❌ Non |
| `confirmed` | Confirmé, QR généré | ✅ Oui |
| `sent` | QR envoyé au client | ✅ Oui |
| `checked_in` | Déjà scanné | ❌ Non (déjà utilisé) |

## 🔒 Sécurité

### Protection Intégrée

1. **Usage unique garanti**
   - Une fois `checked_in`, impossible de re-scanner
   - Le status est vérifié à chaque scan

2. **Validation du format**
   - Le QR doit contenir un JSON valide avec `ticketId`
   - Vérification que le `ticketId` existe dans la DB

3. **Logs détaillés**
   - Chaque scan est loggé avec timestamp
   - Facilite le débogage et la traçabilité

### Exemple de QR Code

Le QR code contient un JSON comme ceci :
```json
{
  "ticketId": "507f1f77bcf86cd799439011",
  "name": "Jean Dupont",
  "quantity": 2,
  "issuedAt": "2024-12-29T10:30:00.000Z"
}
```

## 🎯 Cas d'Usage

### ✅ Scan Réussi (Premier scan)
```
Status: "confirmed" → "checked_in"
Message: "✅ Entrée validée !"
Affichage: Nom, quantité, référence paiement, date de scan
```

### ❌ Scan Échoué (Déjà scanné)
```
Status: Déjà "checked_in"
Message: "❌ Ticket déjà utilisé !"
Affichage: Date du premier scan
```

### ⚠️ Scan Échoué (Non confirmé)
```
Status: "pending"
Message: "⚠️ Ticket non confirmé"
Affichage: Le ticket n'a pas encore été validé par l'admin
```

## 📝 Logs Serveur

Le système affiche des logs pour chaque scan :

```
[SCAN] Tentative de scan pour ticket: 507f1f77bcf86cd799439011
[SCAN] ✅ Ticket valide, marquage comme scanné: 507f1f77bcf86cd799439011
[SCAN] Nom: Jean Dupont, Quantité: 2
[SCAN] ✅ Ticket scanné avec succès: 507f1f77bcf86cd799439011
```

Ou en cas d'erreur :

```
[SCAN] Tentative de scan pour ticket: 507f1f77bcf86cd799439011
[SCAN] Ticket déjà scanné: 507f1f77bcf86cd799439011, Scanné le: 2024-12-29T15:30:00.000Z
```

## 🔄 Réinitialisation (Admin uniquement)

Si besoin de réinitialiser un scan (cas exceptionnel), l'admin peut :
1. Aller dans la base de données
2. Changer le status de `checked_in` à `sent` ou `confirmed`
3. Le ticket pourra être scanné à nouveau

**⚠️ Attention** : Cette opération doit être exceptionnelle et tracée.

## ✅ Résumé

**Le système garantit l'usage unique :**
- ✅ Un QR code = Un scan unique
- ✅ Une fois scanné, le status passe à `checked_in`
- ✅ Les scans suivants sont refusés avec message clair
- ✅ Date de scan enregistrée pour traçabilité
- ✅ Logs détaillés pour chaque opération

**Pas de durée de vie** - C'est basé sur le statut, pas sur une date d'expiration. Une fois scanné, c'est définitif.

