import dotenv from 'dotenv';

dotenv.config();

const parseOrigins = () => {
  const raw = process.env.CORS_ORIGINS;
  if (!raw) return [];
  return raw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/onelife',
  jwtSecret: process.env.JWT_SECRET || 'super-secret-dev',
  adminEmail: process.env.ADMIN_EMAIL || 'admin@onelife.local',
  adminPassword: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  mailFrom: process.env.MAIL_FROM || 'tickets@onelife.local',
  allowedOrigins: parseOrigins(),
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT) || 587,
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  whatsappFrom: process.env.WHATSAPP_FROM,
  smsFrom: process.env.SMS_FROM,
  whatsappToken: process.env.WHATSAPP_TOKEN,
  whatsappPhoneId: process.env.WHATSAPP_PHONE_ID,
  deliverySandbox: process.env.DELIVERY_SANDBOX !== 'false'
};

