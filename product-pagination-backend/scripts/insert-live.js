require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const pool = require("../src/config/db");

async function insertLiveProducts() {
  console.log("🚨 Adding 5 BRAND NEW products to the top of the database...");
  const batchValues = [];

  for (let i = 0; i < 5; i++) {
    batchValues.push([
      uuidv4(),
      `🚀 LIVE DEMO PRODUCT ${i + 1}`,
      "Electronics",
      999.99,
      new Date(), // Current timestamp ensures these appear at the absolute top
      new Date()
    ]);
  }

  const query = `
    INSERT INTO products (id, name, category, price, created_at, updated_at) 
    VALUES ?
  `;

  try {
    await pool.query(query, [batchValues]);
    console.log("✅ Successfully inserted 5 new products at the top!");
    console.log("👉 Now go to your frontend and click 'Load More'.");
    console.log("Notice how Cursor Pagination flawlessly picks up where you left off, neither skipping items nor showing duplicates!");
  } catch (error) {
    console.error("❌ Error inserting live products:", error);
  } finally {
    await pool.end();
  }
}

insertLiveProducts();
