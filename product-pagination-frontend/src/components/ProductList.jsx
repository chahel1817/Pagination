import React from 'react';

const ProductList = ({ products }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!products || products.length === 0) {
    return null; // The parent component handles the empty state
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <div className="product-category">{product.category}</div>
          <div className="product-name">{product.name}</div>
          <div className="product-footer">
            <div className="product-price">${Number(product.price).toFixed(2)}</div>
            <div className="product-date">{formatDate(product.created_at)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;