// controllers/userController.js
const oracledb = require('oracledb');

exports.registerUser = async (req, res) => {
  const { name, email, phone_no, password } = req.body;
  let connection;

  try {
    connection = await oracledb.getConnection({ poolAlias: 'default' });
    
    // Start transaction
    await connection.execute('BEGIN');

    // Using trigger (recommended approach)
    const userResult = await connection.execute(
      `INSERT INTO user_registration (name, email, phone_no, password)
       VALUES (:name, :email, :phone_no, :password)
       RETURNING user_id INTO :user_id`,
      {
        name,
        email,
        phone_no: phone_no || null,
        password,
        user_id: { type: oracledb.NUMBER, dir: oracledb.BIND_OUT }
      },
      { autoCommit: false }
    );

    const user_id = userResult.outBinds.user_id[0];

    // Create cart for the user
    await connection.execute(
      `INSERT INTO cart (cart_id, user_id)
       VALUES (cart_seq.NEXTVAL, :user_id)`,
      { user_id },
      { autoCommit: false }
    );

    await connection.commit();

    res.status(201).json({
      message: 'User registered successfully',
      user_id
    });

  } catch (err) {
    console.error('Registration error:', err);
    
    if (connection) {
      try {
        await connection.rollback();
      } catch (rollbackErr) {
        console.error('Rollback error:', rollbackErr);
      }
    }

    const statusCode = err.message.includes('ORA-02289') ? 400 : 500;
    const errorMessage = err.message.includes('ORA-02289') 
      ? 'Database configuration error - please contact support' 
      : 'Failed to register user';

    res.status(statusCode).json({
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
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