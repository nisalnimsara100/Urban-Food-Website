const oracledb = require('oracledb');
const server = require('../server'); // Import server to access the pool

// Fetch all menu items
exports.getMenuItems = async (req, res) => {
  let connection;
  try {
    console.log('Attempting to get pool from server...');
    const pool = server.getPool();
    console.log('Pool status before request:', pool.status, ', connections in use:', pool.connectionsInUse);
    connection = await pool.getConnection();
    console.log('Database connection established for fetching menu items');

    const binds = {
      p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
    };

    const result = await connection.execute(
      `BEGIN get_all_menu_items(:p_cursor); END;`,
      binds,
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const resultSet = result.outBinds.p_cursor;
    const menuItems = [];

    let row;
    while ((row = await resultSet.getRow())) {
      menuItems.push({
        item_id: row.ITEM_ID,
        name: row.NAME,
        description: row.DESCRIPTION,
        price: row.PRICE.toFixed(2),
        image: row.IMAGE,
        ratings: row.RATINGS,
        qty: row.QTY
      });
    }

    await resultSet.close();
    console.log('Fetched menu items:', menuItems);
    res.status(200).json(menuItems);
  } catch (err) {
    console.error('Error fetching menu items:', err.message, err.stack);
    res.status(500).json({
      error: 'Failed to fetch menu items',
      details: err.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Database connection closed');
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};

// Search menu items by name
exports.searchMenuItems = async (req, res) => {
  let connection;
  try {
    const pool = server.getPool();
    connection = await pool.getConnection();
    console.log('Database connection established for searching menu items');

    const searchTerm = req.query.search || '';
    const binds = {
      p_search_term: searchTerm,
      p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR }
    };

    const result = await connection.execute(
      `BEGIN search_menu_items_by_name(:p_search_term, :p_cursor); END;`,
      binds,
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const resultSet = result.outBinds.p_cursor;
    const menuItems = [];

    let row;
    while ((row = await resultSet.getRow())) {
      menuItems.push({
        item_id: row.ITEM_ID,
        name: row.NAME,
        description: row.DESCRIPTION,
        price: row.PRICE.toFixed(2),
        image: row.IMAGE,
        ratings: row.RATINGS,
        qty: row.QTY
      });
    }

    await resultSet.close();
    console.log('Searched menu items:', menuItems);
    res.status(200).json(menuItems);
  } catch (err) {
    console.error('Error searching menu items:', err.message, err.stack);
    res.status(500).json({
      error: 'Failed to search menu items',
      details: err.message
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('Database connection closed');
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};