const productService = require("../services/productService");

const getProducts = async (req, res) => {
  try {
    const { limit, category, cursorCreatedAt, cursorId } = req.query;
    
    // Parse the date back into a JS Date object for mysql2 to handle correctly
    let parsedCreatedAt = null;
    if (cursorCreatedAt) {
      parsedCreatedAt = new Date(cursorCreatedAt);
    }

    const data = await productService.getProducts({
      limit,
      category,
      cursorCreatedAt: parsedCreatedAt,
      cursorId
    });

    res.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getProducts
};