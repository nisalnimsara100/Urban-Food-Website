const oracledb = require('oracledb');

// Get cart by user_id
const getCartByUser = async (req, res) => {
  const { user_id } = req.params;
  console.log('getCartByUser called with user_id:', user_id);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT * FROM carts WHERE user_id = :user_id`,
      { user_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('Database query result for getCartByUser:', result.rows);
    if (result.rows.length > 0) {
      res.json({ cart: result.rows[0] });
    } else {
      res.json({ cart: null });
    }
  } catch (err) {
    console.error('Error in getCartByUser:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection in getCartByUser:', err);
      }
    }
  }
};

// Add a new cart
const addCart = async (req, res) => {
  const { user_id } = req.body;
  console.log('addCart called with user_id:', user_id);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `INSERT INTO carts (cart_id, user_id) VALUES (carts_seq.NEXTVAL, :user_id) RETURNING cart_id INTO :cart_id`,
      { user_id, cart_id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER } },
      { autoCommit: true }
    );

    const cartId = result.outBinds.cart_id[0];
    console.log('New cart created with cart_id:', cartId, 'for user_id:', user_id);
    res.status(201).json({ cart_id: cartId });
  } catch (err) {
    console.error('Error in addCart:', err);
    res.status(500).json({ error: 'Failed to create cart' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection in addCart:', err);
      }
    }
  }
};

// Get cart items by cart_id
const getCartItems = async (req, res) => {
  const { cart_id } = req.params;
  console.log('getCartItems called with cart_id:', cart_id);

  let connection;
  try {
    connection = await oracledb.getConnection();
    const result = await connection.execute(
      `SELECT ci.cart_item_id, ci.cart_id, ci.item_id, ci.quantity, 
              mi.name, mi.description, mi.price, mi.image, mi.stock_qty
       FROM cart_items ci
       JOIN menu_items mi ON ci.item_id = mi.item_id
       WHERE ci.cart_id = :cart_id`,
      { cart_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('Database query result for getCartItems:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error in getCartItems:', err);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection in getCartItems:', err);
      }
    }
  }
};

// Add item to cart
const addCartItem = async (req, res) => {
  const { cart_id, item_id, quantity } = req.body;
  console.log('addCartItem called with cart_id:', cart_id, 'item_id:', item_id, 'quantity:', quantity);

  let connection;
  try {
    connection = await oracledb.getConnection();

    // Check if the item already exists in the cart
    const existingItem = await connection.execute(
      `SELECT quantity FROM cart_items WHERE cart_id = :cart_id AND item_id = :item_id`,
      { cart_id, item_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('Existing item check result:', existingItem.rows);

    if (existingItem.rows.length > 0) {
      // Update quantity if item exists
      const newQuantity = existingItem.rows[0].QUANTITY + quantity;
      await connection.execute(
        `UPDATE cart_items SET quantity = :quantity WHERE cart_id = :cart_id AND item_id = :item_id`,
        { quantity: newQuantity, cart_id, item_id },
        { autoCommit: true }
      );
      console.log('Updated quantity for cart_id:', cart_id, 'item_id:', item_id, 'new quantity:', newQuantity);
    } else {
      // Insert new item
      await connection.execute(
        `INSERT INTO cart_items (cart_item_id, cart_id, item_id, quantity) 
         VALUES (cart_items_seq.NEXTVAL, :cart_id, :item_id, :quantity)`,
        { cart_id, item_id, quantity },
        { autoCommit: true }
      );
      console.log('Inserted new item into cart_items, cart_id:', cart_id, 'item_id:', item_id, 'quantity:', quantity);
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    console.error('Error in addCartItem:', err);
    res.status(500).json({ error: 'Failed to add item to cart' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection in addCartItem:', err);
      }
    }
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  const { cart_id, item_id, quantity } = req.body;
  console.log('updateCartItem called with cart_id:', cart_id, 'item_id:', item_id, 'quantity:', quantity);

  let connection;
  try {
    connection = await oracledb.getConnection();
    await connection.execute(
      `UPDATE cart_items SET quantity = :quantity WHERE cart_id = :cart_id AND item_id = :item_id`,
      { quantity, cart_id, item_id },
      { autoCommit: true }
    );

    console.log('Updated cart item quantity, cart_id:', cart_id, 'item_id:', item_id, 'new quantity:', quantity);
    res.json({ message: 'Cart item updated' });
  } catch (err) {
    console.error('Error in updateCartItem:', err);
    res.status(500).json({ error: 'Failed to update cart item' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection in updateCartItem:', err);
      }
    }
  }
};

// Remove item from cart
const deleteCartItem = async (req, res) => {
  const { cart_id, item_id } = req.params;
  console.log('deleteCartItem called with cart_id:', cart_id, 'item_id:', item_id);

  let connection;
  try {
    connection = await oracledb.getConnection();
    await connection.execute(
      `DELETE FROM cart_items WHERE cart_id = :cart_id AND item_id = :item_id`,
      { cart_id, item_id },
      { autoCommit: true }
    );

    console.log('Deleted cart item, cart_id:', cart_id, 'item_id:', item_id);
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Error in deleteCartItem:', err);
    res.status(500).json({ error: 'Failed to remove item from cart' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection in deleteCartItem:', err);
      }
    }
  }
};

// Get cart item count for header
const getCartCount = async (req, res) => {
  const { user_id } = req.params;
  console.log('getCartCount called with user_id:', user_id);

  let connection;
  try {
    connection = await oracledb.getConnection();

    // First, get the cart_id for the user
    const cartResult = await connection.execute(
      `SELECT cart_id FROM carts WHERE user_id = :user_id`,
      { user_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('Cart query result for getCartCount:', cartResult.rows);

    if (cartResult.rows.length === 0) {
      console.log('No cart found for user_id:', user_id, 'returning count: 0');
      return res.json({ count: 0 });
    }

    const cart_id = cartResult.rows[0].CART_ID;

    // Then, count the items in the cart
    const countResult = await connection.execute(
      `SELECT SUM(quantity) AS total FROM cart_items WHERE cart_id = :cart_id`,
      { cart_id },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    console.log('Count query result for getCartCount:', countResult.rows);
    const count = countResult.rows[0].TOTAL || 0;
    console.log('Returning cart count:', count);
    res.json({ count });
  } catch (err) {
    console.error('Error in getCartCount:', err);
    res.status(500).json({ error: 'Failed to fetch cart count' });
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection in getCartCount:', err);
      }
    }
  }
};

module.exports = {
  getCartByUser,
  addCart,
  getCartItems,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  getCartCount,
};