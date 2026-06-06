const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const fs = require('fs');

if (fs.existsSync('.env')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'));
  for (const k in envConfig) process.env[k] = envConfig[k];
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_SECURE !== 'false',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function run() {
  console.log("Testing local SMTP connection using configured env variables...");
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_PASS length:", process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 0);
  try {
    await transporter.verify();
    console.log("SMTP connection verified successfully!");
  } catch (err) {
    console.error("SMTP verification failed:", err);
  }
}
run();
