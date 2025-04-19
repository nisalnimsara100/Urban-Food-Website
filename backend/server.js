// server.js
const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const dbConfig = require('./dbConfig');
const { MongoClient } = require('mongodb'); // Import MongoDB driver

const app = express();
let pool;

// MongoDB Atlas connection details
const mongoUrl = 'mongodb+srv://nisalnimsara100:nisal@cluster0.xuu9isr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const dbName = 'urbanfood';
let mongoClient = null;
let mongoDB = null;

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Debug middleware for requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request to ${req.url}`);
  next();
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Initialize Oracle Instant Client
try {
  oracledb.initOracleClient({ libDir: '/opt/oracle/instantclient_23_3' });
  console.log('Oracle Instant Client initialized');
} catch (err) {
  console.error('Failed to initialize Oracle Instant Client:', err);
  process.exit(1);
}

// Create a connection pool for OracleDB
async function initPool() {
  try {
    pool = await oracledb.createPool(dbConfig);
    console.log('Connection pool created');
    console.log('Pool status:', pool.status);
  } catch (err) {
    console.error('Failed to create connection pool:', err);
    throw err;
  }
}

// Test endpoint to verify OracleDB connection
app.get('/test', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.execute('SELECT SYSDATE FROM DUAL');
    const currentDate = result.rows[0][0];
    res.status(200).json({ message: 'OracleDB connection successful', currentDate });
  } catch (err) {
    console.error('Test query failed:', err);
    res.status(500).json({ error: 'Failed to connect to OracleDB', details: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
});

// Initialize MongoDB Atlas connection
async function initMongoDB() {
  try {
    mongoClient = new MongoClient(mongoUrl);
    await mongoClient.connect();
    console.log('Connected to MongoDB Atlas');
    mongoDB = mongoClient.db(dbName);
  } catch (err) {
    console.error('Failed to connect to MongoDB Atlas:', err);
    throw err;
  }
}

// Test endpoint to verify MongoDB Atlas connection and fetch data
app.get('/test-mongodb', async (req, res) => {
  try {
    if (!mongoDB) {
      await initMongoDB();
    }

    const ratingsCollection = mongoDB.collection('menu_ratings');
    const ratings = await ratingsCollection.find({}).toArray();
    console.log('Fetched ratings from MongoDB Atlas:', ratings);

    res.status(200).json({
      message: 'MongoDB Atlas connection successful',
      ratings,
    });
  } catch (err) {
    console.error('MongoDB test failed:', err);
    res.status(500).json({
      error: 'Failed to connect to MongoDB Atlas or fetch data',
      details: err.message,
    });
  }
});

// Gracefully close the OracleDB pool and MongoDB connection on server shutdown
process.on('SIGTERM', async () => {
  console.log('Closing connections...');
  try {
    // Close OracleDB pool
    if (pool) {
      await pool.close(10);
      console.log('OracleDB connection pool closed');
    }

    // Close MongoDB connection
    if (mongoClient) {
      await mongoClient.close();
      console.log('MongoDB Atlas connection closed');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error closing connections:', err);
    process.exit(1);
  }
});

// Export pool for use in controllers
exports.getPool = () => {
  if (!pool) {
    throw new Error('Connection pool not initialized');
  }
  return pool;
};

// Function to mount routes
function mountRoutes() {
  // Include user routes
  try {
    const userRoutes = require('./routes/userRoutes');
    console.log('User routes module loaded:', userRoutes);
    app.use('/api/users', userRoutes);
    console.log('User routes mounted successfully');
  } catch (err) {
    console.error('Failed to load user routes:', err);
  }

  // Include menu routes
  try {
    const menuRoutes = require('./routes/menuRoutes');
    console.log('Menu routes module loaded:', menuRoutes);
    app.use('/api/menu', menuRoutes);
    console.log('Menu routes mounted successfully');
  } catch (err) {
    console.error('Failed to load menu routes:', err.message, err.stack);
  }

  // Include cart routes
  try {
    const cartRoutes = require('./routes/cartRoutes');
    console.log('Cart routes module loaded:', cartRoutes);
    app.use('/api/cart', cartRoutes);
    console.log('Cart routes mounted successfully');
  } catch (err) {
    console.error('Failed to load cart routes:', err.message, err.stack);
  }
}

// Initialize the OracleDB pool, MongoDB connection, and start the server
Promise.all([initPool(), initMongoDB()])
  .then(() => {
    console.log('Pool and MongoDB initialization complete, mounting routes...');
    // Share the MongoDB connection with mongodb.js
    const { setMongoDB } = require('./mongodb');
    setMongoDB(mongoDB);
    mountRoutes(); // Mount routes after both are initialized

    const PORT = 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      setInterval(() => {
        console.log('Server is still running...');
      }, 5000);
    });
  })
  .catch(err => {
    console.error('Failed to initialize pool or MongoDB and start server:', err);
    process.exit(1);
  });