const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

if (fs.existsSync('../.env')) {
  const envConfig = dotenv.parse(fs.readFileSync('../.env'));
  for (const k in envConfig) process.env[k] = envConfig[k];
}

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("MONGODB_URI not found");
  process.exit(1);
}

const API_BASE = 'http://localhost:5000/api';

async function runTest() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(mongoUri);
  console.log("Connected.");

  const Admin = require('../models/Admin');

  // Ensure default admin is seeded
  console.log("Resetting admin user to default state...");
  await Admin.update({ email: 'zeeshanshussain0999@gmail.com' }, {
    username: 'Ai+rizwan#1974000hussain!#/',
    password: '@#12Rizwan55Hussain/!#7861974000!12',
    email: 'zeeshanshussain0999@gmail.com',
    otp: null,
    otpExpires: null
  });

  // Step 1: Login with default credentials
  console.log("\n--- Testing Login with Default Credentials ---");
  let loginRes = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Ai+rizwan#1974000hussain!#/',
      password: '@#12Rizwan55Hussain/!#7861974000!12'
    })
  });
  let loginData = await loginRes.json();
  console.log("Login Status:", loginRes.status);
  console.log("Login Response:", loginData);
  if (loginRes.status !== 200) throw new Error("Default login failed");

  // Step 2: Trigger forgot password
  console.log("\n--- Testing Trigger Forgot Password ---");
  let forgotRes = await fetch(`${API_BASE}/admin/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'zeeshanshussain0999@gmail.com' })
  });
  let forgotData = await forgotRes.json();
  console.log("Forgot Password Status:", forgotRes.status);
  console.log("Forgot Password Response:", forgotData);
  if (forgotRes.status !== 200) throw new Error("Forgot password request failed");

  // Step 3: Fetch OTP directly from database
  console.log("\n--- Fetching OTP from DB ---");
  const adminDoc = await Admin.findOne({ email: 'zeeshanshussain0999@gmail.com' });
  console.log("Admin OTP in database:", adminDoc.otp);
  if (!adminDoc.otp) throw new Error("OTP not saved in database");

  // Step 4: Verify OTP
  console.log("\n--- Testing Verify OTP ---");
  let verifyRes = await fetch(`${API_BASE}/api/admin/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'zeeshanshussain0999@gmail.com',
      otp: adminDoc.otp
    })
  });
  // Note: if endpoint is /api/admin/verify-otp or /admin/verify-otp, let's use the correct one based on our server configuration
  // Let's check: in server, the route is /api/admin/verify-otp
  let verifyUrl = `${API_BASE}/admin/verify-otp`;
  verifyRes = await fetch(verifyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'zeeshanshussain0999@gmail.com',
      otp: adminDoc.otp
    })
  });
  let verifyData = await verifyRes.json();
  console.log("Verify OTP Status:", verifyRes.status);
  console.log("Verify OTP Response:", verifyData);
  if (verifyRes.status !== 200) throw new Error("OTP verification failed");

  // Step 5: Reset password
  console.log("\n--- Testing Reset Password ---");
  let resetRes = await fetch(`${API_BASE}/admin/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'zeeshanshussain0999@gmail.com',
      otp: adminDoc.otp,
      newUsername: 'admin_test_temp',
      newPassword: 'temp_password_123'
    })
  });
  let resetData = await resetRes.json();
  console.log("Reset Password Status:", resetRes.status);
  console.log("Reset Password Response:", resetData);
  if (resetRes.status !== 200) throw new Error("Password reset failed");

  // Step 6: Verify login with new credentials
  console.log("\n--- Testing Login with New Credentials ---");
  let newLoginRes = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'admin_test_temp',
      password: 'temp_password_123'
    })
  });
  let newLoginData = await newLoginRes.json();
  console.log("New Login Status:", newLoginRes.status);
  console.log("New Login Response:", newLoginData);
  if (newLoginRes.status !== 200) throw new Error("New login failed");

  // Step 7: Update credentials via update-credentials route
  console.log("\n--- Testing Update Credentials via Settings ---");
  let updateRes = await fetch(`${API_BASE}/admin/update-credentials`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      currentUsername: 'admin_test_temp',
      currentPassword: 'temp_password_123',
      newUsername: 'Ai+rizwan#1974000hussain!#/',
      newPassword: '@#12Rizwan55Hussain/!#7861974000!12'
    })
  });
  let updateData = await updateRes.json();
  console.log("Update Credentials Status:", updateRes.status);
  console.log("Update Credentials Response:", updateData);
  if (updateRes.status !== 200) throw new Error("Update credentials failed");

  // Step 8: Verify restored login
  console.log("\n--- Testing Login with Restored Default Credentials ---");
  let restoredLoginRes = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: 'Ai+rizwan#1974000hussain!#/',
      password: '@#12Rizwan55Hussain/!#7861974000!12'
    })
  });
  let restoredLoginData = await restoredLoginRes.json();
  console.log("Restored Login Status:", restoredLoginRes.status);
  console.log("Restored Login Response:", restoredLoginData);
  if (restoredLoginRes.status !== 200) throw new Error("Restored login failed");

  console.log("\n🎉 ALL API AUTHENTICATION TESTS PASSED SUCCESSFULLY! 🎉");
  await mongoose.disconnect();
}

runTest().catch(async err => {
  console.error("❌ Test failed:", err);
  await mongoose.disconnect();
  process.exit(1);
});
