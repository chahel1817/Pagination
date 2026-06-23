const mysql = require("mysql2/promise");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const BATCH_SIZE = 5000;
const TOTAL_RECORDS = 200000;
const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Toys", "Automotive", "Books", "Health", "Beauty", "Grocery"];

function getRandomCategory() {
  return categories[Math.floor(Math.random() * categories.length)];
}

function getRandomPrice() {
  return (Math.random() * 1000 + 1).toFixed(2);
}

async function seed() {
  let pool;
  try {
    // Connect without database to create it if it doesn't exist
    const initConnection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || ""
    });
    
    const dbName = process.env.DB_NAME || "pagination_db";
    await initConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await initConnection.end();

    // Now connect to the database
    pool = mysql.createPool({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: dbName,
      connectionLimit: 10
    });

    console.log("Creating products table if it doesn't exist...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(36) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        created_at DATETIME(3) NOT NULL,
        updated_at DATETIME(3) NOT NULL
      )
    `);

    console.log("Truncating existing table to clear old data...");
    await pool.query("TRUNCATE TABLE products");

    console.log("Creating indexes...");
    try {
      await pool.query("CREATE INDEX idx_created_id ON products(created_at DESC, id DESC)");
      await pool.query("CREATE INDEX idx_category_created_id ON products(category, created_at DESC, id DESC)");
    } catch (e) {
      console.log("Indexes might already exist, continuing...");
    }

    console.log(`Starting bulk insertion of ${TOTAL_RECORDS} records...`);
    const startTime = Date.now();
    let inserted = 0;
    const baseDate = new Date();
    
    while (inserted < TOTAL_RECORDS) {
      const recordsToInsert = Math.min(BATCH_SIZE, TOTAL_RECORDS - inserted);
      const values = [];
      
      for (let i = 0; i < recordsToInsert; i++) {
        const id = uuidv4();
        const name = `Product ${inserted + i + 1}`;
        const category = getRandomCategory();
        const price = getRandomPrice();
        
        // Generate random date within the last 30 days
        const randomTimeOffset = Math.random() * 30 * 24 * 60 * 60 * 1000;
        const createdAt = new Date(baseDate.getTime() - randomTimeOffset);
        
        // Format as YYYY-MM-DD HH:MM:SS.mmm for DATETIME(3)
        const formattedDate = createdAt.toISOString().slice(0, 19).replace('T', ' ') + '.' + createdAt.getUTCMilliseconds().toString().padStart(3, '0');
        
        values.push([id, name, category, price, formattedDate, formattedDate]);
      }
      
      // Perform bulk insert
      const query = "INSERT INTO products (id, name, category, price, created_at, updated_at) VALUES ?";
      await pool.query(query, [values]);
      
      inserted += recordsToInsert;
      console.log(`Inserted ${inserted} / ${TOTAL_RECORDS} products...`);
    }
    
    const endTime = Date.now();
    console.log(`\nSeed completed successfully in ${(endTime - startTime) / 1000} seconds!`);
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    if (pool) await pool.end();
  }
}

seed();
