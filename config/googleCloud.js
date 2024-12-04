const { PubSub } = require('@google-cloud/pubsub');
require('dotenv').config();

console.log('GOOGLE_CLOUD_PROJECT:', process.env.GOOGLE_CLOUD_PROJECT);
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

const pubsub = new PubSub({
  projectId: process.env.GOOGLE_CLOUD_PROJECT, 
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, 
});

module.exports = pubsub;