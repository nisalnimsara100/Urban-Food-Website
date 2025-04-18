// server.js
const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');
const dbConfig = require('./dbConfig');

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Oracle Instant Client
try {
  oracledb.initOracleClient({ libDir: 'C:\\oracle\\instantclient_23_7' });
} catch (err) {
  console.error('Failed to initialize Oracle Instant Client:', err);
  process.exit(1);
}

// Create a connection pool
async function initPool() {
  try {
    await oracledb.createPool(dbConfig);
    console.log('Connection pool created');
  } catch (err) {
    console.error('Failed to create connection pool:', err);
    process.exit(1);
  }
}

// Fetch all menu items using get_all_menu_items procedure
app.get('/menu', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `BEGIN get_all_menu_items(:cursor); END;`,
      { cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR } },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    const resultSet = result.outBinds.cursor;
    const rows = [];
    let row;
    while ((row = await resultSet.getRow())) {
      rows.push(row);
    }
    await resultSet.close();
    res.json(rows);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ error: 'Failed to fetch menu items', details: err.message });
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

// Test endpoint to verify database connection
app.get('/test', async (req, res) => {
  let connection;
  try {
    connection = await oracledb.getConnection();
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
    await oracledb.getPool().close(10);
    console.log('Connection pool closed');
    process.exit(0);
  } catch (err) {
    console.error('Error closing pool:', err);
    process.exit(1);
  }
});

// Initialize the pool and start the server
initPool().then(() => {
  app.listen(5000, () => {
    console.log('Server running on port 5000');
  });
});