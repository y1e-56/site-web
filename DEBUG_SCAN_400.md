# 🔍 Debug Erreur 400 - Scanner QR

## ❌ Erreur Observée

```
POST http://localhost:5000/api/scanner/validate 400 (Bad Request)
```

## 🔎 Causes Possibles

### 1. **QR Code Vide ou Manquant**
- Le champ `qrPayload` est vide
- **Solution** : Vérifiez que vous avez bien collé le contenu du QR

### 2. **Format JSON Incorrect**
- Le contenu collé n'est pas un JSON valide
- **Exemple d'erreur** : `{"ticketId":"123"` (guillemet manquant)
- **Solution** : Vérifiez que le JSON est complet et valide

### 3. **ticketId Manquant**
- Le JSON ne contient pas le champ `ticketId`
- **Solution** : Le QR doit contenir : `{"ticketId":"...","name":"...","quantity":1,"issuedAt":"..."}`

### 4. **Problème d'Authentification**
- La route nécessite une authentification (`requireAuth`)
- **Solution** : Connectez-vous d'abord en tant qu'admin

### 5. **Caractères Invisibles**
- Espaces ou retours à la ligne en trop
- **Solution** : Le système trim automatiquement maintenant

## ✅ Format Attendu du QR Code

Le QR code doit contenir un JSON comme ceci :

```json
{
  "ticketId": "507f1f77bcf86cd799439011",
  "name": "Jean Dupont",
  "quantity": 2,
  "issuedAt": "2024-12-29T10:30:00.000Z"
}
```

## 🔧 Comment Déboguer

### 1. Vérifier les Logs Serveur

Regardez la console du serveur, vous devriez voir :

```
[SCAN] Requête reçue, body: {"qrPayload":"..."}
[SCAN] Tentative de parsing JSON, longueur: 123
[SCAN] JSON parsé avec succès: { ticketId: '...', ... }
[SCAN] ticketId extrait: 507f1f77bcf86cd799439011
```

### 2. Vérifier la Console Navigateur

Ouvrez la console (F12) et regardez :

```javascript
[SCAN] Envoi du QR: {"ticketId":"507f1f77bcf86cd799439011"...
[SCAN] Erreur complète: { response: { status: 400, data: { message: '...' } } }
```

### 3. Tester avec un QR Valide

1. Allez dans le dashboard admin
2. Confirmez un ticket (génère le QR)
3. Téléchargez le QR code
4. Scannez-le avec votre téléphone
5. Copiez le contenu JSON complet
6. Collez-le dans le formulaire scanner

## 🛠️ Solutions

### Si "QR manquant"
- Vérifiez que le champ n'est pas vide
- Vérifiez que vous avez bien cliqué sur "Coller"

### Si "Format JSON incorrect"
- Vérifiez que vous avez copié **tout** le contenu
- Vérifiez qu'il n'y a pas de caractères supplémentaires
- Essayez de coller dans un éditeur de texte pour voir le contenu exact

### Si "ID ticket manquant"
- Vérifiez que le JSON contient bien `"ticketId"`
- Vérifiez que le QR code a été généré correctement
- Regénérez le QR code depuis le dashboard admin

### Si "Erreur 401"
- Connectez-vous d'abord en tant qu'admin
- Allez sur `/login`
- Puis retournez sur `/scanner`

## 📝 Checklist de Vérification

Avant de scanner :
- [ ] Serveur démarré (port 5000)
- [ ] Connecté en tant qu'admin (si nécessaire)
- [ ] QR code généré et téléchargé
- [ ] QR code scanné avec l'appareil photo
- [ ] Contenu JSON copié complètement
- [ ] Contenu collé dans le formulaire
- [ ] Format JSON valide (vérifiable avec JSONLint)

## 🎯 Test Rapide

Pour tester rapidement, vous pouvez coller ce JSON de test (remplacez le ticketId par un ID réel) :

```json
{"ticketId":"507f1f77bcf86cd799439011","name":"Test","quantity":1,"issuedAt":"2024-12-29T10:30:00.000Z"}
```

**Note** : Remplacez `507f1f77bcf86cd799439011` par un ID de ticket réel de votre base de données.

## 📞 Logs à Vérifier

### Console Serveur
```
[SCAN] Requête reçue, body: ...
[SCAN] Tentative de parsing JSON...
[SCAN] Erreur parsing QR: ... (si erreur)
[SCAN] ticketId extrait: ... (si succès)
```

### Console Navigateur
```
[SCAN] Envoi du QR: ...
[SCAN] Réponse reçue: ... (si succès)
[SCAN] Erreur complète: ... (si erreur)
```

