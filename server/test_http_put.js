const express = require('express');
const cors = require('cors');
require('dotenv').config();
const http = require('http');

// Let's import the app from index.js
// Wait, is index.js exporting the app or listening immediately?
// Let's check how index.js is structured.
const fs = require('fs');
const indexContent = fs.readFileSync('index.js', 'utf8');

// If index.js runs app.listen(), it will start on port 5000 by default.
// Let's write a script that starts index.js, then sends a PUT request to http://localhost:5000/api/admin/plans/...
// and prints the result.

const { spawn } = require('child_process');

async function testHttp() {
  console.log("Starting backend server...");
  const serverProc = spawn('node', ['index.js'], { stdio: 'pipe' });
  
  // Wait for server to start (listen for port or success msg)
  await new Promise((resolve) => {
    serverProc.stdout.on('data', (data) => {
      const msg = data.toString();
      console.log(`[Server]: ${msg.trim()}`);
      if (msg.includes('5000') || msg.includes('listen') || msg.includes('connected')) {
        resolve();
      }
    });
    serverProc.stderr.on('data', (data) => {
      console.error(`[Server Error]: ${data.toString().trim()}`);
    });
    // Fallback timeout
    setTimeout(resolve, 3000);
  });

  console.log("Fetching services...");
  try {
    const getRes = await fetch('http://localhost:5000/api/plans');
    const plans = await getRes.json();
    if (!plans || plans.length === 0) {
      console.log("No services in database to update!");
      serverProc.kill();
      process.exit(1);
    }
    
    const targetService = plans[0];
    console.log(`Targeting service: ${targetService.name} (id: ${targetService._id})`);
    
    // Change the price of the first plan
    const updatedService = JSON.parse(JSON.stringify(targetService));
    if (updatedService.plans && updatedService.plans.length > 0) {
      updatedService.plans[0].price = '₹' + (parseInt(updatedService.plans[0].price.replace(/[^0-9]/g, '')) + 1 || 199);
    }
    
    console.log("Sending PUT request to http://localhost:5000/api/admin/plans/" + targetService._id);
    const putRes = await fetch(`http://localhost:5000/api/admin/plans/${targetService._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedService)
    });
    
    console.log("Response Status:", putRes.status);
    const resBody = await putRes.json();
    console.log("Response Body:", resBody);
    
  } catch (err) {
    console.error("HTTP test failed:", err);
  } finally {
    console.log("Killing server process...");
    serverProc.kill();
    process.exit(0);
  }
}

testHttp();
