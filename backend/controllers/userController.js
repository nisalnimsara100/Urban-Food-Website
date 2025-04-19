const oracledb = require('oracledb');

exports.registerUser = async (req, res) => {
  const { name, email, phone_no, password } = req.body;
  let connection;

  try {
    console.log('Attempting to get connection from pool...');
    connection = await oracledb.getConnection({ poolAlias: 'default' });
    console.log('Database connection established for registration');

    // Insert user into user_registration table
    const userResult = await connection.execute(
      `INSERT INTO user_registration (user_id, name, email, phone_no, password)
       VALUES (user_registration_seq.NEXTVAL, :name, :email, :phone_no, :password)
       RETURNING user_id INTO :user_id`,
      {
        name,
        email,
        phone_no,
        password,
        user_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: false }
    );

    const user_id = userResult.outBinds.user_id[0];
    console.log('User inserted with ID:', user_id);

    // Insert a cart for the user into the cart table
    await connection.execute(
      `INSERT INTO cart (cart_id, user_id)
       VALUES (cart_seq.NEXTVAL, :user_id)`,
      { user_id },
      { autoCommit: false }
    );

    // Commit the transaction
    await connection.commit();
    console.log('Transaction committed');

    res.status(201).json({
      message: 'User registered successfully',
      user_id
    });
  } catch (err) {
    console.error('Error during user registration:', err);
    if (connection) {
      try {
        await connection.rollback();
        console.log('Transaction rolled back');
      } catch (rollbackErr) {
        console.error('Error during rollback:', rollbackErr);
      }
    }
    res.status(500).json({
      error: 'Failed to register user',
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

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  let connection;

  try {
    console.log('Attempting to get connection from pool...');
    connection = await oracledb.getConnection({ poolAlias: 'default' });
    console.log('Database connection established for login');

    const result = await connection.execute(
      `SELECT user_id, name, email, phone_no
       FROM user_registration
       WHERE email = :email AND password = :password`,
      { email, password }
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = {
      user_id: result.rows[0][0],
      name: result.rows[0][1],
      email: result.rows[0][2],
      phone_no: result.rows[0][3]
    };

    res.status(200).json({
      message: 'Login successful',
      user
    });
  } catch (err) {
    console.error('Error during user login:', err);
    res.status(500).json({
      error: 'Failed to login',
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