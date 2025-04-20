const oracledb = require('oracledb');
const { connectToMongoDB } = require('../mongodb'); // Import MongoDB connection utility

// Register a new user (updated to store OracleDB user_id in MongoDB)
exports.registerUser = async (req, res) => {
  const { name, email, phone_no, password } = req.body;
  let connection;

  try {
    // Step 1: Connect to OracleDB and register the user
    connection = await oracledb.getConnection({ poolAlias: 'default' });

    const binds = {
      p_name: name,
      p_email: email,
      p_phone_no: phone_no || null,
      p_password: password,
      p_error_code: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
      p_error_msg: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 4000 },
    };

    const result = await connection.execute(
      `BEGIN add_user(:p_name, :p_email, :p_phone_no, :p_password, :p_error_code, :p_error_msg); END;`,
      binds
    );

    const errorCode = result.outBinds.p_error_code;
    const errorMsg = result.outBinds.p_error_msg;

    if (errorCode !== 0) {
      return res.status(400).json({ error: errorMsg });
    }

    // Fetch the newly created user to return their user_id
    const userResult = await connection.execute(
      `SELECT user_id, name, email, phone_no, created_at
       FROM user_registration
       WHERE email = :email`,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (userResult.rows.length === 0) {
      return res.status(500).json({ error: 'Failed to retrieve newly registered user' });
    }

    const user = userResult.rows[0];

    // Step 2: Connect to MongoDB and insert the user into the 'users' collection
    try {
      const mongoDB = await connectToMongoDB(); // Get MongoDB connection
      const usersCollection = mongoDB.collection('users');

      // Prepare the user data to insert into MongoDB, including OracleDB user_id
      const mongoUser = {
        oracle_user_id: user.USER_ID, // Store OracleDB user_id
        name: user.NAME,
        email: user.EMAIL,
        password: password, // Note: In a production app, you should hash the password
        created_at: new Date(user.CREATED_AT), // Convert OracleDB date to JavaScript Date
      };

      // Insert the user into MongoDB
      const mongoResult = await usersCollection.insertOne(mongoUser);
      console.log('User inserted into MongoDB:', mongoResult.insertedId);
    } catch (mongoErr) {
      console.error('Failed to insert user into MongoDB:', mongoErr);
      // Log the error but allow registration to succeed since OracleDB is the primary DB
    }

    // Step 3: Return the response with the user data from OracleDB
    res.status(201).json({
      message: 'Registration successful',
      user_id: user.USER_ID,
      user: {
        user_id: user.USER_ID,
        name: user.NAME,
        email: user.EMAIL,
        phone_no: user.PHONE_NO,
        created_at: user.CREATED_AT,
      },
    });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).json({ error: 'Failed to register user', details: err.message });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};

// Login a user (updated to return OracleDB user_id)
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Connect to MongoDB
    const mongoDB = await connectToMongoDB();
    const usersCollection = mongoDB.collection('users');

    // Find the user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check password (in a real app, passwords should be hashed)
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Prepare the response using the OracleDB user_id
    const userResponse = {
      user_id: user.oracle_user_id, // Use the stored OracleDB user_id
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };

    res.status(200).json({
      message: 'Login successful',
      user: userResponse,
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Failed to login', details: err.message });
  }
};

// Get user by ID (unchanged)
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    connection = await oracledb.getConnection({ poolAlias: 'default' });

    const result = await connection.execute(
      `SELECT user_id, name, email, phone_no, created_at
       FROM user_registration
       WHERE user_id = :id`,
      { id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({
      error: 'Failed to fetch user',
      details: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};

// Get user by email (unchanged)
exports.getUserByEmail = async (req, res) => {
  const { email } = req.query;
  let connection;

  try {
    connection = await oracledb.getConnection({ poolAlias: 'default' });

    const result = await connection.execute(
      `SELECT user_id, name, email, phone_no, created_at
       FROM user_registration
       WHERE email = :email`,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.status(200).json({ user });
  } catch (err) {
    console.error('Error fetching user by email:', err);
    res.status(500).json({
      error: 'Failed to fetch user by email',
      details: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};

// Update user (unchanged)
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone_no } = req.body;
  let connection;

  try {
    connection = await oracledb.getConnection({ poolAlias: 'default' });

    const result = await connection.execute(
      `UPDATE user_registration
       SET name = :name, email = :email, phone_no = :phone_no
       WHERE user_id = :id
       RETURNING user_id, name, email, phone_no, created_at INTO :user_id, :name_out, :email_out, :phone_no_out, :created_at_out`,
      {
        name,
        email,
        phone_no: phone_no || null,
        id,
        user_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER },
        name_out: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        email_out: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        phone_no_out: { dir: oracledb.BIND_OUT, type: oracledb.STRING },
        created_at_out: { dir: oracledb.BIND_OUT, type: oracledb.DATE },
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updatedUser = {
      user_id: result.outBinds.user_id,
      name: result.outBinds.name_out,
      email: result.outBinds.email_out,
      phone_no: result.outBinds.phone_no_out,
      created_at: result.outBinds.created_at_out,
    };

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({
      error: 'Failed to update user',
      details: err.message,
    });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err);
      }
    }
  }
};