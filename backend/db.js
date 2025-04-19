const oracledb = require('oracledb');
const dbConfig = require('./dbConfig');

let pool;

async function initializePool() {
  if (pool) {
    console.log('Pool already initialized');
    return pool;
  }

  try {
    // Initialize Oracle Instant Client
    oracledb.initOracleClient({ libDir: '/opt/oracle/instantclient_23_3' });
    console.log('Oracle Instant Client initialized');

    pool = await oracledb.createPool(dbConfig);
    console.log('Connection pool created');
    return pool;
  } catch (err) {
    console.error('Failed to initialize connection pool:', err);
    throw err;
  }
}

async function getPool() {
  if (!pool) {
    await initializePool();
  }
  return pool;
}

async function closePool() {
  if (pool) {
    try {
      await pool.close(10);
      console.log('Connection pool closed');
      pool = null;
    } catch (err) {
      console.error('Error closing pool:', err);
      throw err;
    }
  }
}

module.exports = {
  getPool,
  closePool,
  initializePool
};