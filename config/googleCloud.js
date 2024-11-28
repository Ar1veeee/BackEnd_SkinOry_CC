const { PubSub } = require("@google-cloud/pubsub");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "service-account.json");
const pubsub = new PubSub({
  keyFilename: serviceAccountPath,
});

module.exports = pubsub;
