// menuController.js
const oracledb = require('oracledb');
const server = require('../server'); // Import server to access the pool
const { connectToMongoDB } = require('../mongodb'); // Import MongoDB connection

// Fetch all menu items
exports.getMenuItems = async (req, res) => {
  let connection;
  let mongoDB;
  try {
    console.log('Handling GET /api/menu request...');

    // Connect to OracleDB
    console.log('Attempting to get pool from server...');
    const pool = server.getPool();
    console.log('Pool retrieved:', pool);
    console.log('Pool status before request:', pool.status, ', connections in use:', pool.connectionsInUse);
    connection = await pool.getConnection();
    console.log('Database connection established for fetching menu items');

    // Fetch menu items from OracleDB
    console.log('Executing OracleDB query...');
    const binds = {
      p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
    };

    const result = await connection.execute(
      `BEGIN get_all_menu_items(:p_cursor); END;`,
      binds,
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    console.log('OracleDB query executed:', result);

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
        qty: row.QTY,
        ratings: null, // We'll populate this from MongoDB Atlas
      });
    }

    await resultSet.close();
    console.log('Fetched menu items from OracleDB:', menuItems);

    // Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    mongoDB = await connectToMongoDB();
    console.log('MongoDB connection established');
    const ratingsCollection = mongoDB.collection('menu_ratings');

    // Fetch ratings for all item_ids
    const itemIds = menuItems.map((item) => item.item_id);
    console.log('Fetching ratings for item_ids:', itemIds);
    const ratings = await ratingsCollection
      .find({ item_id: { $in: itemIds } })
      .toArray();
    console.log('Fetched ratings from MongoDB Atlas:', ratings);

    // Merge ratings into menuItems
    menuItems.forEach((item) => {
      const ratingEntry = ratings.find((rating) => rating.item_id === item.item_id);
      item.ratings = ratingEntry ? ratingEntry.ratings : 0; // Default to 0 if no rating found
    });

    console.log('Menu items with ratings:', menuItems);
    res.status(200).json(menuItems);
  } catch (err) {
    console.error('Error fetching menu items:', err.message, err.stack);
    res.status(500).json({
      error: 'Failed to fetch menu items',
      details: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('OracleDB connection closed');
      } catch (err) {
        console.error('Error closing OracleDB connection:', err);
      }
    }
  }
};

// Search menu items by name (unchanged, but add logging if needed)
exports.searchMenuItems = async (req, res) => {
  let connection;
  let mongoDB;
  try {
    console.log('Handling GET /api/menu/search request...');
    // Connect to OracleDB
    const pool = server.getPool();
    connection = await pool.getConnection();
    console.log('Database connection established for searching menu items');

    const searchTerm = req.query.search || '';
    const binds = {
      p_search_term: searchTerm,
      p_cursor: { dir: oracledb.BIND_OUT, type: oracledb.CURSOR },
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
        qty: row.QTY,
        ratings: null, // We'll populate this from MongoDB Atlas
      });
    }

    await resultSet.close();
    console.log('Searched menu items from OracleDB:', menuItems);

    // Connect to MongoDB Atlas
    mongoDB = await connectToMongoDB();
    const ratingsCollection = mongoDB.collection('menu_ratings');

    // Fetch ratings for all item_ids
    const itemIds = menuItems.map((item) => item.item_id);
    const ratings = await ratingsCollection
      .find({ item_id: { $in: itemIds } })
      .toArray();
    console.log('Fetched ratings from MongoDB Atlas:', ratings);

    // Merge ratings into menuItems
    menuItems.forEach((item) => {
      const ratingEntry = ratings.find((rating) => rating.item_id === item.item_id);
      item.ratings = ratingEntry ? ratingEntry.ratings : 0; // Default to 0 if no rating found
    });

    console.log('Searched menu items with ratings:', menuItems);
    res.status(200).json(menuItems);
  } catch (err) {
    console.error('Error searching menu items:', err.message, err.stack);
    res.status(500).json({
      error: 'Failed to search menu items',
      details: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log('OracleDB connection closed');
      } catch (err) {
        console.error('Error closing OracleDB connection:', err);
      }
    }
  }
};