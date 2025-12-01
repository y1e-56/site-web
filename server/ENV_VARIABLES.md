# Variables d'environnement nécessaires

Copiez ces variables dans Render (section Environment Variables) :

## Variables obligatoires

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/onelife?retryWrites=true&w=majority
JWT_SECRET=[générez une chaîne aléatoire forte]
ADMIN_EMAIL=admin@onelife.com
ADMIN_PASSWORD=[choisissez un mot de passe fort]
CORS_ORIGINS=https://votre-site.vercel.app
```

## Variables optionnelles

```
MAIL_FROM=tickets@onelife.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre-email@gmail.com
SMTP_PASS=votre-mot-de-passe-app
WHATSAPP_FROM=+1234567890
WHATSAPP_TOKEN=votre-token
WHATSAPP_PHONE_ID=votre-phone-id
SMS_FROM=+1234567890
DELIVERY_SANDBOX=true
```

## Comment générer JWT_SECRET

**Windows (PowerShell) :**
```powershell
powershell -Command "[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))"
```

**Mac/Linux :**
```bash
openssl rand -base64 32
```

