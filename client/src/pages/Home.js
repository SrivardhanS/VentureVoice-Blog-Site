import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [selectedCategory]);

  const fetchBlogs = async () => {
    try {
      let url = '/api/blogs';
      if (selectedCategory) {
        url = `/api/blogs/category/${selectedCategory}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch blogs');
      }
      const data = await response.json();
      setBlogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setLoading(true);
  };

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>StartupBlogs</h1>
        <p>Discover insights, stories, and strategies from the startup world</p>
        <Link to="/create" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Write Your Blog
        </Link>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        <button
          className={selectedCategory === '' ? 'active' : ''}
          onClick={() => handleCategoryFilter('')}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            className={selectedCategory === category.id.toString() ? 'active' : ''}
            onClick={() => handleCategoryFilter(category.id.toString())}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Blog Grid */}
      {blogs.length === 0 ? (
        <div className="no-blogs">
          <h3>No blogs found</h3>
          <p>
            {selectedCategory 
              ? 'No blogs in this category yet. Try selecting a different category or'
              : 'Be the first to share your startup insights!'
            }
          </p>
          <Link to="/create" className="btn btn-primary">
            Write the First Blog
          </Link>
        </div>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;