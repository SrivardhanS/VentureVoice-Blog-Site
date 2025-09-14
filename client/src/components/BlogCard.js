import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Link to={`/blog/${blog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="blog-card">
        <h3>{blog.title}</h3>
        <div className="blog-meta">
          <span>By {blog.author}</span>
          <span className="category-badge">{blog.category_name || 'Uncategorized'}</span>
        </div>
        <p className="blog-content">
          {blog.content.length > 150 
            ? blog.content.substring(0, 150) + '...' 
            : blog.content
          }
        </p>
        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#718096' }}>
          {formatDate(blog.created_at)}
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;