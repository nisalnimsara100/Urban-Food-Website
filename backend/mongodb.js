// mongodb.js
let sharedMongoDB = null;

function setMongoDB(db) {
  sharedMongoDB = db;
  console.log('MongoDB connection shared with mongodb.js');
}

async function connectToMongoDB() {
  if (sharedMongoDB) {
    return sharedMongoDB;
  }
  throw new Error('MongoDB connection not initialized. Call setMongoDB first.');
}

async function closeMongoDBConnection() {
  // Connection is managed by server.js, no need to close here
  console.log('closeMongoDBConnection called (no action taken, managed by server.js)');
}

module.exports = {
  connectToMongoDB,
  closeMongoDBConnection,
  setMongoDB,
};