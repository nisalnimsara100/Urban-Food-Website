const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const dbConfig = require('./dbConfig');

const app = express();
let pool;

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

// Create a connection pool
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

// Test endpoint to verify database connection
app.get('/test', async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const result = await connection.execute('SELECT SYSDATE FROM DUAL');
    const currentDate = result.rows[0][0];
    res.status(200).json({ message: 'Database connection successful', currentDate });
  } catch (err) {
    console.error('Test query failed:', err);
    res.status(500).json({ error: 'Failed to connect to database', details: err.message });
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

// Gracefully close the pool on server shutdown
process.on('SIGTERM', async () => {
  console.log('Closing connection pool');
  try {
    await pool.close(10);
    console.log('Connection pool closed');
    process.exit(0);
  } catch (err) {
    console.error('Error closing pool:', err);
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
}

// Initialize the pool and start the server
initPool()
  .then(() => {
    console.log('Pool initialization complete, mounting routes...');
    mountRoutes(); // Mount routes after pool is initialized

    const PORT = 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      setInterval(() => {
        console.log('Server is still running...');
      }, 5000);
    });
  })
  .catch(err => {
    console.error('Failed to initialize pool and start server:', err);
    process.exit(1);
  });