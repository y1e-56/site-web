# 🔗 Aide pour votre URI MongoDB Atlas

## Votre URI actuelle

```
mongodb+srv://jipnangryan237_db_user:<db_password>@onelifecluster.7oot0wy.mongodb.net/?appName=ONElifecluster
```

## ✅ Ce qu'il faut faire

### 1. Remplacer `<db_password>`

Remplacez `<db_password>` par le **vrai mot de passe** que vous avez créé pour l'utilisateur `jipnangryan237_db_user` dans MongoDB Atlas.

**⚠️ Attention aux caractères spéciaux :**
Si votre mot de passe contient des caractères spéciaux, encodez-les :
- `@` → `%40`
- `#` → `%23`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- `/` → `%2F`

### 2. Ajouter le nom de la base de données

Ajoutez `/onelife` juste avant le `?` dans l'URI.

### 3. Format final

**Structure :**
```
mongodb+srv://jipnangryan237_db_user:VOTRE_MOT_DE_PASSE@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority
```

**Exemples :**

Si votre mot de passe est `MyPassword123` :
```
mongodb+srv://jipnangryan237_db_user:MyPassword123@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority
```

Si votre mot de passe est `Pass@123` (avec @) :
```
mongodb+srv://jipnangryan237_db_user:Pass%40123@onelifecluster.7oot0wy.mongodb.net/onelife?retryWrites=true&w=majority
```

## 📝 Pour Render

Copiez l'URI finale complète et collez-la dans la variable d'environnement `MONGODB_URI` sur Render.

## 🔍 Comment trouver votre mot de passe

Si vous avez oublié le mot de passe :
1. Allez sur MongoDB Atlas
2. Menu "Database Access"
3. Cliquez sur l'utilisateur `jipnangryan237_db_user`
4. Cliquez sur "Edit" → "Edit Password"
5. Vous pouvez soit :
   - Voir le mot de passe actuel (s'il est affiché)
   - Ou en créer un nouveau

