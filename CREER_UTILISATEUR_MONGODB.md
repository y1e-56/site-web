# 👤 Créer/Modifier l'utilisateur MongoDB Atlas

## Option 1 : Si l'utilisateur `jipnangryan237_db_user` existe déjà

### Modifier le mot de passe

1. **Connectez-vous à MongoDB Atlas** : https://cloud.mongodb.com
2. Dans le menu de gauche, cliquez sur **"Database Access"** (ou "Security" → "Database Access")
3. Vous verrez la liste de tous les utilisateurs
4. Trouvez l'utilisateur **`jipnangryan237_db_user`** dans la liste
5. Cliquez sur le bouton **"Edit"** (icône crayon) à droite de l'utilisateur
6. Cliquez sur **"Edit Password"**
7. Vous avez deux options :
   - **Option A** : Cliquez sur **"Autogenerate Secure Password"** pour générer un mot de passe aléatoire fort
   - **Option B** : Créez votre propre mot de passe (minimum 8 caractères, avec majuscules, minuscules, chiffres)
8. **⚠️ IMPORTANT** : 
   - Si vous avez généré automatiquement, **COPIEZ LE MOT DE PASSE** immédiatement (il ne sera plus visible après)
   - Si vous l'avez créé vous-même, **NOTEZ-LE** quelque part de sûr
9. Cliquez sur **"Update User"**

---

## Option 2 : Créer un nouvel utilisateur (si l'ancien n'existe pas)

1. **Connectez-vous à MongoDB Atlas** : https://cloud.mongodb.com
2. Dans le menu de gauche, cliquez sur **"Database Access"** (ou "Security" → "Database Access")
3. Cliquez sur le bouton vert **"+ ADD NEW DATABASE USER"** (en haut à droite)
4. **Méthode d'authentification** : Choisissez **"Password"**
5. **Username** : Entrez `jipnangryan237_db_user` (ou un autre nom si vous préférez)
6. **Password** : 
   - Cliquez sur **"Autogenerate Secure Password"** pour un mot de passe sécurisé automatique
   - **OU** créez votre propre mot de passe (minimum 8 caractères)
   - **⚠️ COPIEZ/NOTEZ LE MOT DE PASSE** immédiatement !
7. **User Privileges** : 
   - Choisissez **"Atlas Admin"** (recommandé pour commencer)
   - OU **"Read and write to any database"** si vous préférez
8. Cliquez sur **"Add User"** (en bas)

---

## 📝 Après avoir créé/modifié l'utilisateur

### 1. Formater votre URI MongoDB

Une fois que vous avez le mot de passe, formatez votre URI comme ceci :

```
mongodb+srv://jipnangryan237_db_user:VOTRE_MOT_DE_PASSE@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority
```

**Remplacez `VOTRE_MOT_DE_PASSE` par le mot de passe que vous venez de créer.**

### 2. Exemple

Si votre mot de passe est `MySecurePass123` :
```
mongodb+srv://jipnangryan237_db_user:MySecurePass123@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority
```

### 3. Caractères spéciaux dans le mot de passe

Si votre mot de passe contient des caractères spéciaux, encodez-les :
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- `/` → `%2F`

**Exemple** : Si votre mot de passe est `Pass@123#` :
```
mongodb+srv://jipnangryan237_db_user:Pass%40123%23@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority
```

---

## ✅ Vérification

Pour vérifier que votre URI fonctionne :

1. Copiez votre URI complète
2. Vous pourrez la tester lors du déploiement sur Render
3. Si elle ne fonctionne pas, vérifiez :
   - Le nom d'utilisateur est correct
   - Le mot de passe est correct (et encodé si nécessaire)
   - L'accès réseau est autorisé (voir section 1.3 du guide principal)

---

## 🔒 Sécurité

- **Ne partagez jamais** votre URI complète avec le mot de passe
- **Sauvegardez** votre mot de passe dans un gestionnaire de mots de passe
- Pour la production, limitez l'accès réseau aux IPs de Render uniquement

