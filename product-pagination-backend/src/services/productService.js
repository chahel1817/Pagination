const pool = require("../config/db");

const getProducts = async ({ limit = 20, category, cursorCreatedAt, cursorId }) => {
  const parsedLimit = parseInt(limit, 10);
  const params = [];
  
  let query = `
    SELECT id, name, category, price, created_at, updated_at 
    FROM products 
  `;
  
  const conditions = [];

  if (category) {
    conditions.push(`category = ?`);
    params.push(category);
  }

  if (cursorCreatedAt && cursorId) {
    // Cursor condition: smaller created_at, or same created_at but smaller id
    conditions.push(`(created_at < ? OR (created_at = ? AND id < ?))`);
    params.push(cursorCreatedAt, cursorCreatedAt, cursorId);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(" AND ");
  }

  query += ` ORDER BY created_at DESC, id DESC LIMIT ?`;
  params.push(parsedLimit);

  const [rows] = await pool.query(query, params);
  
  let nextCursor = null;
  // If we fetched exactly 'limit' items, there might be more, so we return the cursor for the last item.
  if (rows.length === parsedLimit) {
    const lastRow = rows[rows.length - 1];
    nextCursor = {
      created_at: lastRow.created_at,
      id: lastRow.id
    };
  }

  return { products: rows, nextCursor };
};

module.exports = {
  getProducts
};