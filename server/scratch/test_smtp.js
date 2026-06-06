const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'zeeshanshussain0999@gmail.com',
    pass: '@Zeeshan9999'
  }
});

async function run() {
  console.log("Testing SMTP connection...");
  try {
    await transporter.verify();
    console.log("SMTP connection verified successfully!");
  } catch (err) {
    console.error("SMTP verification failed:", err);
  }
}
run();
