# 🔧 Corriger l'erreur MongoDB sur Render

## ❌ Erreur rencontrée

```
Mongo connection error: Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"
```

## 🔍 Cause du problème

Cette erreur signifie que la variable d'environnement `MONGODB_URI` dans Render est :
- **Soit** : Non définie (vide)
- **Soit** : Mal formatée (ne commence pas par `mongodb://` ou `mongodb+srv://`)

## ✅ Solution : Vérifier et corriger dans Render

### Étape 1 : Aller dans Render

1. Connectez-vous sur **https://dashboard.render.com**
2. Cliquez sur votre service **`onelife-api`** (ou le nom que vous avez donné)

### Étape 2 : Vérifier les variables d'environnement

1. Dans le menu de gauche, cliquez sur **"Environment"** (ou "Environment Variables")
2. Cherchez la variable **`MONGODB_URI`**
3. Vérifiez qu'elle existe et qu'elle est correctement formatée

### Étape 3 : Ajouter/Corriger MONGODB_URI

Si la variable n'existe pas ou est incorrecte :

1. Cliquez sur **"Add Environment Variable"** (ou "Edit" si elle existe)
2. **Key** : `MONGODB_URI`
3. **Value** : Collez votre URI MongoDB Atlas complète

**Format attendu :**
```
mongodb+srv://jipnangryan237_db_user:VOTRE_MOT_DE_PASSE@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority
```

**⚠️ Important :**
- Remplacez `VOTRE_MOT_DE_PASSE` par le **vrai mot de passe** de l'utilisateur MongoDB
- L'URI doit commencer par `mongodb+srv://`
- L'URI doit contenir `/onelife` avant le `?`
- Si le mot de passe contient des caractères spéciaux, encodez-les (voir ci-dessous)

### Étape 4 : Encoder les caractères spéciaux (si nécessaire)

Si votre mot de passe MongoDB contient des caractères spéciaux, encodez-les :

| Caractère | Encodage |
|-----------|----------|
| `@` | `%40` |
| `#` | `%23` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `?` | `%3F` |
| `/` | `%2F` |
| ` ` (espace) | `%20` |

**Exemple :**
- Mot de passe : `Pass@123#`
- Encodé : `Pass%40123%23`
- URI : `mongodb+srv://jipnangryan237_db_user:Pass%40123%23@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority`

### Étape 5 : Sauvegarder et redéployer

1. Cliquez sur **"Save Changes"** (ou "Update")
2. Render va **automatiquement redéployer** votre service
3. Attendez 2-3 minutes
4. Vérifiez les **Logs** pour voir si la connexion fonctionne

## ✅ Vérification

Une fois redéployé, vérifiez les logs :

1. Dans Render, allez dans l'onglet **"Logs"**
2. Vous devriez voir : `🗄️  MongoDB connected`
3. Si vous voyez encore une erreur, vérifiez :
   - Que l'URI est complète et correcte
   - Que le mot de passe est correct
   - Que l'accès réseau est autorisé dans MongoDB Atlas

## 🔍 Exemple d'URI correcte

```
mongodb+srv://jipnangryan237_db_user:MonMotDePasse123@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority
```

**Structure :**
- `mongodb+srv://` : Protocole
- `jipnangryan237_db_user` : Nom d'utilisateur
- `MonMotDePasse123` : Mot de passe
- `onelifecluster.7oot0wy.mongodb.net` : Cluster MongoDB
- `/onelife` : Nom de la base de données
- `?retryWrites=true&w=majority` : Paramètres de connexion

## 🐛 Si ça ne fonctionne toujours pas

1. **Vérifiez MongoDB Atlas** :
   - Allez sur https://cloud.mongodb.com
   - Vérifiez que l'utilisateur `jipnangryan237_db_user` existe
   - Vérifiez que le mot de passe est correct
   - Vérifiez que l'accès réseau autorise `0.0.0.0/0` (ou les IPs de Render)

2. **Testez l'URI localement** :
   - Créez un fichier `.env` dans le dossier `server`
   - Ajoutez : `MONGODB_URI=votre_uri_complete`
   - Lancez : `npm start`
   - Vérifiez si ça fonctionne

3. **Vérifiez les logs Render** :
   - Les logs affichent maintenant un message plus détaillé
   - Cela vous aidera à identifier le problème exact

---

**💡 Astuce** : Copiez-collez l'URI directement depuis MongoDB Atlas (section "Connect" → "Connect your application") et remplacez seulement le mot de passe.

