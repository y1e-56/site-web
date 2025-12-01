# 📱 Guide d'Accès à la Page Scanner

## 🎯 Comment accéder à la page Scanner

Il y a **3 façons** d'accéder à la page Scanner :

### Méthode 1 : Via la Navigation (Barre du haut)
1. Regarde en haut de la page, dans la barre de navigation
2. Clique sur le bouton **"📱 Scanner QR"** (bouton bleu/violet)
3. Tu arrives directement sur la page `/scanner`

### Méthode 2 : Via le Dashboard Admin
1. Va sur la page Admin (`/admin`)
2. En haut à droite, tu verras un bouton **"📱 Scanner QR"**
3. Clique dessus pour accéder au scanner

### Méthode 3 : URL Directe
1. Tape directement dans la barre d'adresse : `http://localhost:5173/scanner`
2. Ou si en production : `https://ton-site.com/scanner`

## 📋 Processus Complet de Scan

### Étape 1 : Accéder à la Page Scanner
- Clique sur **"📱 Scanner QR"** dans la navigation ou le dashboard
- Tu arrives sur la page avec le formulaire de scan

### Étape 2 : Scanner le QR Code
1. **Sur ton téléphone** :
   - Ouvre l'application **Appareil Photo**
   - Pointe la caméra vers le QR code du client
   - L'appareil photo détecte automatiquement le QR

2. **Copier le contenu** :
   - Après le scan, l'appareil photo affiche un lien ou le contenu
   - **Clique sur le lien** affiché
   - Le contenu JSON s'affiche (ex: `{"ticketId":"...","name":"..."}`)
   - **Copie tout le texte** (sélectionne et copie)

### Étape 3 : Coller dans le Formulaire
1. **Retourne sur la page Scanner** (sur ton ordinateur/tablette)
2. **Colle le contenu** dans le champ texte :
   - Soit avec Ctrl+V (Windows) ou Cmd+V (Mac)
   - Soit en cliquant sur **"📋 Coller depuis le presse-papiers"**
3. Le contenu JSON apparaît dans le champ

### Étape 4 : Valider
1. Clique sur le bouton **"✅ Valider le QR code"**
2. Le système vérifie le QR code
3. Un message s'affiche :
   - ✅ **"Entrée validée !"** si c'est valide
   - ❌ **"Ticket déjà utilisé !"** si déjà scanné
   - ⚠️ **"Ticket non confirmé"** si pas encore validé

## 🖼️ À quoi ressemble la page Scanner

```
┌─────────────────────────────────────┐
│  Navigation: [ONE Life] [Scanner QR] │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  📱 Scanner QR                       │
│  Accès 29 décembre                  │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│  📱 Comment scanner un QR code :    │
│  1. Ouvre l'appareil photo...      │
│  2. Scanne le QR code...            │
│  3. Copie le contenu...             │
│                                     │
│  [Champ texte pour coller le QR]    │
│                                     │
│  [📋 Coller] [✅ Valider]           │
└─────────────────────────────────────┘
```

## 💡 Astuces

### Sur Mobile
- Certains téléphones permettent de **scanner directement** depuis l'appareil photo
- Après le scan, **appui long** sur le texte pour copier automatiquement

### Sur Ordinateur
- Si tu as le QR code en image, utilise un **scanner QR en ligne**
- Ou utilise une **application de scan QR** sur ton téléphone

### Si ça ne fonctionne pas
1. Vérifie que tu es bien sur la page `/scanner`
2. Vérifie que le contenu collé est bien du JSON valide
3. Vérifie que le serveur est démarré (port 5000)
4. Regarde la console du navigateur pour les erreurs

## 🔗 Liens Rapides

- **Page Scanner** : `http://localhost:5173/scanner`
- **Dashboard Admin** : `http://localhost:5173/admin`
- **Page Publique** : `http://localhost:5173/`

## ✅ Checklist

Avant de scanner :
- [ ] Page Scanner accessible (`/scanner`)
- [ ] Serveur backend démarré (port 5000)
- [ ] QR code du client disponible
- [ ] Application appareil photo prête

Pendant le scan :
- [ ] QR code scanné avec succès
- [ ] Contenu JSON copié
- [ ] Contenu collé dans le formulaire
- [ ] Bouton "Valider" cliqué

Après le scan :
- [ ] Message de résultat affiché
- [ ] Ticket marqué comme `checked_in` dans la DB
- [ ] Date de scan enregistrée

