require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const pool = require("../src/config/db");

const categoryProducts = {
  Electronics: ["Laptop", "Smartphone", "Headphones", "Smart Watch"],
  Fashion: ["T-Shirt", "Jeans", "Jacket", "Sneakers"],
  Books: ["Novel", "Textbook", "Biography", "Magazine"],
  Sports: ["Football", "Cricket Bat", "Basketball", "Tennis Racket"],
  Gaming: ["Gaming Mouse", "Keyboard", "Console", "Controller"],
  "Home & Kitchen": ["Mixer", "Cookware Set", "Vacuum Cleaner", "Microwave"],
  "Beauty & Personal Care": ["Face Wash", "Perfume", "Shampoo", "Moisturizer"],
  "Toys & Kids": ["Toy Car", "Puzzle", "Doll", "Building Blocks"],
  Automotive: ["Car Cover", "Helmet", "Tyre Inflator", "Dash Cam"],
  "Health & Fitness": ["Dumbbell", "Yoga Mat", "Protein Shaker", "Treadmill"]
};

const categories = Object.keys(categoryProducts);

// Configurations
const TOTAL_PRODUCTS = 200000;
const BATCH_SIZE = 10000;

async function seedDatabase() {
  console.log("Starting high-performance database seed...");
  let inserted = 0;

  try {
    for (let i = 0; i < TOTAL_PRODUCTS; i += BATCH_SIZE) {
      const batchValues = [];

      for (let j = 0; j < BATCH_SIZE; j++) {
        if (inserted >= TOTAL_PRODUCTS) break;

        // Generate product data exactly as requested
        const category = categories[Math.floor(Math.random() * categories.length)];
        const productName = categoryProducts[category][Math.floor(Math.random() * categoryProducts[category].length)];
        const name = `${productName} ${inserted + 1}`;
        
        // Random price between 5.00 and 1500.00
        const price = (Math.random() * (1500 - 5) + 5).toFixed(2);
        
        // Random date within roughly the last 2 years
        const randomTimeOffset = Math.floor(Math.random() * 63072000000); 
        const createdAt = new Date(Date.now() - randomTimeOffset);

        batchValues.push([
          uuidv4(),
          name,
          category,
          price,
          createdAt,
          createdAt // Setting updated_at equal to created_at for seed data
        ]);
        
        inserted++;
      }

      // Execute bulk insert (array of arrays passed to a single ?)
      const query = `
        INSERT INTO products (id, name, category, price, created_at, updated_at) 
        VALUES ?
      `;

      await pool.query(query, [batchValues]);
      console.log(`Inserted ${inserted} / ${TOTAL_PRODUCTS} products...`);
    }

    console.log("🎉 Database seeded successfully with 200,000 products!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    // Close the connection pool so the script can exit
    await pool.end();
  }
}

seedDatabase();