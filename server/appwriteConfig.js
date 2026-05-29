const { Client, Databases } = require('node-appwrite');
require('dotenv').config();

const client = new Client();

const endpoint = process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (projectId && apiKey) {
  client
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);
}

const databases = new Databases(client);

module.exports = {
  client,
  databases,
  databaseId: process.env.APPWRITE_DATABASE_ID || 'streambazaar_db',
  plansCollectionId: process.env.APPWRITE_PLANS_COLLECTION_ID || 'plans_collection',
  ordersCollectionId: process.env.APPWRITE_ORDERS_COLLECTION_ID || 'orders_collection'
};
