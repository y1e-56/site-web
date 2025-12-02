# ⚡ Solution Rapide CORS - "Origin non autorisée"

## 🎯 Solution en 2 Étapes

### Étape 1 : Configurer CORS dans Render (2 minutes)

1. **Va sur https://dashboard.render.com**
2. **Clique sur ton service backend**
3. **Environment** → Trouve `CORS_ORIGINS`
4. **Edit** → Remplace par : `*`
5. **Save**

⚠️ **`*` accepte TOUT** (moins sécurisé mais fonctionne à coup sûr)

### Étape 2 : Redémarrer le Service

1. Dans Render → Ton service → **Manual Deploy**
2. **Deploy latest commit**
3. **Attends 2-3 minutes**

## ✅ C'est Tout !

Une fois fait, l'erreur CORS disparaîtra.

---

## 🔒 Solution Plus Sécurisée (Plus Tard)

Quand tu auras le temps, remplace `*` par :
```
https://*.vercel.app
```

Mais pour l'instant, `*` résout le problème immédiatement.

---

**🚀 Fais juste ça et ça marchera !**

