require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const { Service } = require('./models/dbAdapter');

async function testUpdate() {
  const all = await Service.find({});
  if (all.length > 0) {
    const doc = all[0];
    console.log("Original _id type:", typeof doc._id, doc._id);
    try {
      const updatePayload = { ...doc };
      updatePayload.name = doc.name + " Test";
      
      const res = await Service.update({ _id: doc._id }, { $set: updatePayload });
      console.log("Update success:", res);
    } catch (e) {
      console.error("Update error:", e.message);
    }
  } else {
    console.log("No data found");
  }
  process.exit();
}

testUpdate();
