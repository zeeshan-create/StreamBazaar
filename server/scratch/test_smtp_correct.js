const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'zeeshanhussain0999@gmail.com',
    pass: 'ypqdamlqipwqobtc'
  }
});

async function run() {
  console.log("Testing SMTP with corrected email spelling...");
  try {
    await transporter.verify();
    console.log("SMTP connection verified successfully!");
  } catch (err) {
    console.error("SMTP verification failed:", err);
  }
}
run();
