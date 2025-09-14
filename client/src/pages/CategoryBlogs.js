import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';

const CategoryBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { categoryId } = useParams();

  useEffect(() => {
    fetchCategoryBlogs();
    fetchCategory();
  }, [categoryId]);

  const fetchCategoryBlogs = async () => {
    try {
      const response = await fetch(`/api/blogs/category/${categoryId}`);
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

  const fetchCategory = async () => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`);
      if (!response.ok) {
        throw new Error('Category not found');
      }
      const data = await response.json();
      setCategory(data);
    } catch (err) {
      console.error('Error fetching category:', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading blogs...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="category-blogs-page">
      <div className="page-header">
        <h1>{category?.name || 'Category'} Blogs</h1>
        <p>
          {category?.description || 'Explore blogs in this category'} 
          {category?.blog_count && ` • ${category.blog_count} blog${category.blog_count !== 1 ? 's' : ''}`}
        </p>
        <Link to="/" className="btn btn-secondary" style={{ marginTop: '1rem' }}>
          ← Back to All Blogs
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="no-blogs">
          <h3>No blogs in this category yet</h3>
          <p>Be the first to write about {category?.name.toLowerCase()}!</p>
          <Link to="/create" className="btn btn-primary">
            Write a Blog
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

export default CategoryBlogs;