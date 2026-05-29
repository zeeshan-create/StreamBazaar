const { Client, Databases } = require('node-appwrite');
require('dotenv').config();

const client = new Client();

const endpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!projectId || !apiKey) {
  console.error("❌ ERROR: APPWRITE_PROJECT_ID and APPWRITE_API_KEY are required in .env");
  process.exit(1);
}

client
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setKey(apiKey);

const databases = new Databases(client);

const databaseId = process.env.APPWRITE_DATABASE_ID || 'streambazaar_db';
const plansCollectionId = process.env.APPWRITE_PLANS_COLLECTION_ID || 'plans_collection';
const ordersCollectionId = process.env.APPWRITE_ORDERS_COLLECTION_ID || 'orders_collection';

async function setup() {
  try {
    // 1. Create Database (ignoring error if it already exists)
    try {
      console.log('Creating database...');
      await databases.create(databaseId, 'StreamBazaar DB');
      console.log('✅ Database created');
    } catch (e) {
      if (e.code === 409) console.log('✅ Database already exists');
      else throw e;
    }

    // 2. Create Plans Collection
    try {
      console.log('Creating Plans collection...');
      await databases.createCollection(databaseId, plansCollectionId, 'Plans');
      console.log('✅ Plans collection created');
      
      // Create Attributes for Plans
      await databases.createStringAttribute(databaseId, plansCollectionId, 'name', 255, true);
      await databases.createStringAttribute(databaseId, plansCollectionId, 'category', 255, true);
      await databases.createStringAttribute(databaseId, plansCollectionId, 'color', 50, false);
      await databases.createStringAttribute(databaseId, plansCollectionId, 'description', 500, false);
      // plans attribute will hold a JSON string since array of objects is not fully supported
      await databases.createStringAttribute(databaseId, plansCollectionId, 'plans', 5000, false);
      console.log('✅ Plans attributes created');

    } catch (e) {
      if (e.code === 409) console.log('✅ Plans collection already exists');
      else throw e;
    }

    // 3. Create Orders Collection
    try {
      console.log('Creating Orders collection...');
      await databases.createCollection(databaseId, ordersCollectionId, 'Orders');
      console.log('✅ Orders collection created');

      // Create Attributes for Orders
      await databases.createStringAttribute(databaseId, ordersCollectionId, 'name', 255, true);
      await databases.createStringAttribute(databaseId, ordersCollectionId, 'email', 255, true);
      await databases.createStringAttribute(databaseId, ordersCollectionId, 'product', 255, false);
      await databases.createStringAttribute(databaseId, ordersCollectionId, 'plan', 255, false);
      await databases.createStringAttribute(databaseId, ordersCollectionId, 'device', 255, false);
      await databases.createStringAttribute(databaseId, ordersCollectionId, 'price', 50, false);
      await databases.createStringAttribute(databaseId, ordersCollectionId, 'role', 50, false);
      await databases.createStringAttribute(databaseId, ordersCollectionId, 'status', 50, false);
      await databases.createStringAttribute(databaseId, ordersCollectionId, 'date', 100, false);
      console.log('✅ Orders attributes created');

    } catch (e) {
      if (e.code === 409) console.log('✅ Orders collection already exists');
      else throw e;
    }

    console.log('\n🎉 Setup complete! Next step: Restart your server.');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setup();
