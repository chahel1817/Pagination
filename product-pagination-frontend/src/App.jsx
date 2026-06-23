import React, { useState, useEffect } from 'react';
import CategoryFilter from './components/CategoryFilter';
import ProductList from './components/ProductList';
import { getProducts } from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInitialProducts = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts(20, category);
      setProducts(data.products);
      setNextCursor(data.nextCursor);
    } catch (err) {
      setError("Failed to load products. Ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialProducts(selectedCategory);
  }, [selectedCategory]);

  const handleLoadMore = async () => {
    if (!nextCursor || loading) return;
    
    setLoading(true);
    try {
      const data = await getProducts(20, selectedCategory, nextCursor.created_at, nextCursor.id);
      
      // We append new products while preventing duplicates just in case (though backend handles it)
      setProducts(prev => {
        const existingIds = new Set(prev.map(p => p.id));
        const newProducts = data.products.filter(p => !existingIds.has(p.id));
        return [...prev, ...newProducts];
      });
      setNextCursor(data.nextCursor);
    } catch (err) {
      setError("Failed to load more products.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>Bazaario</h1>
        <p>Premium E-Commerce Platform</p>
      </header>

      <main className="main-content">
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            setNextCursor(null);
            setProducts([]);
          }} 
        />
        
        <section className="product-section">
          {error && <div className="error-message">{error}</div>}
          
          <ProductList products={products} />
          
          {loading && <div className="loading-spinner">Loading...</div>}
          
          {!loading && nextCursor && (
            <button className="load-more" onClick={handleLoadMore}>
              Load More
            </button>
          )}
          
          {!loading && !nextCursor && products.length > 0 && (
            <div className="no-more-data">
              You've reached the end of the catalog.
            </div>
          )}

          {!loading && products.length === 0 && !error && (
            <div className="no-more-data">
              No products found in this category.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;