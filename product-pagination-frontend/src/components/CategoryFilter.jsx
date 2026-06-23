import React from 'react';

const CATEGORIES = [
  'All',
  'Electronics',
  'Fashion',
  'Books',
  'Sports',
  'Gaming',
  'Home & Kitchen',
  'Beauty & Personal Care',
  'Toys & Kids',
  'Automotive',
  'Health & Fitness'
];

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  return (
    <aside className="category-filter">
      <h3>Categories</h3>
      <div className="category-list">
        {CATEGORIES.map(category => (
          <button
            key={category}
            className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default CategoryFilter;