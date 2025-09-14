import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import BlogCard from '../components/BlogCard';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlog();
  }, [id]);

  useEffect(() => {
    if (blog && blog.category_id) {
      fetchRecommendedBlogs();
    }
  }, [blog]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${id}`);
      if (!response.ok) {
        throw new Error('Blog not found');
      }
      const data = await response.json();
      setBlog(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedBlogs = async () => {
    try {
      const response = await fetch(`/api/blogs/category/${blog.category_id}`);
      if (response.ok) {
        const data = await response.json();
        // Filter out current blog and get max 4 recommendations
        const filtered = data.filter(b => b.id !== parseInt(id)).slice(0, 4);
        setRecommendedBlogs(filtered);
      }
    } catch (err) {
      console.error('Error fetching recommended blogs:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
      return;
    }

    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete blog');
      }

      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format content with line breaks
  const formatContent = (content) => {
    if (!content) return null;
    
    // Handle both line breaks and paragraphs
    const paragraphs = content.split('\n').filter(paragraph => paragraph.trim() !== '');
    
    return paragraphs.map((paragraph, index) => (
      <p key={index} style={{ marginBottom: '1.5rem', lineHeight: '1.7' }}>
        {paragraph.trim()}
      </p>
    ));
  };

  if (loading) {
    return <div className="loading">Loading blog...</div>;
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

  if (!blog) {
    return (
      <div className="error">
        Blog not found
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        {/* Main Content */}
        <div className="blog-main-content">
          <div className="blog-detail">
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              lineHeight: '1.2',
              color: '#2d3748'
            }}>
              {blog.title}
            </h1>
            
            <div className="blog-meta" style={{ 
              marginBottom: '2rem',
              padding: '1rem 0',
              borderBottom: '1px solid #e2e8f0'
            }}>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>
                  By <strong>{blog.author}</strong>
                </span>
                {blog.category_name && (
                  <>
                    <span style={{ margin: '0 0.5rem', color: '#cbd5e0' }}>•</span>
                    <Link 
                      to={`/category/${blog.category_id}`}
                      className="category-badge"
                      style={{ 
                        textDecoration: 'none',
                        backgroundColor: '#667eea',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '9999px',
                        fontSize: '0.875rem',
                        fontWeight: '500'
                      }}
                    >
                      {blog.category_name}
                    </Link>
                  </>
                )}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                <span>Published: {formatDate(blog.created_at)}</span>
                {blog.updated_at !== blog.created_at && (
                  <div>
                    <span>Updated: {formatDate(blog.updated_at)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="blog-content" style={{ 
              fontSize: '1.125rem',
              lineHeight: '1.8',
              color: '#4a5568',
              marginBottom: '3rem'
            }}>
              {formatContent(blog.content)}
            </div>

            <div className="blog-actions" style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
              paddingTop: '2rem',
              borderTop: '1px solid #e2e8f0'
            }}>
              <Link to="/" className="btn btn-secondary">
                ← Back to Home
              </Link>
              <Link to={`/edit/${blog.id}`} className="btn btn-primary">
                Edit Blog
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete Blog'}
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations Sidebar */}
        <div className="blog-sidebar">
          <div className="recommendations-section">
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              color: '#2d3748'
            }}>
              Recommended for You
            </h3>
            
            {recommendedBlogs.length > 0 ? (
              <div className="recommended-blogs">
                {recommendedBlogs.map((recommendedBlog) => (
                  <div key={recommendedBlog.id} className="recommended-blog-card">
                    <Link 
                      to={`/blog/${recommendedBlog.id}`} 
                      style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      <h4 style={{ 
                        fontSize: '1.1rem', 
                        fontWeight: '600', 
                        marginBottom: '0.5rem',
                        lineHeight: '1.4'
                      }}>
                        {recommendedBlog.title}
                      </h4>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#718096', 
                        marginBottom: '0.5rem',
                        lineHeight: '1.5'
                      }}>
                        {recommendedBlog.content.length > 100 
                          ? recommendedBlog.content.substring(0, 100) + '...' 
                          : recommendedBlog.content
                        }
                      </p>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: '#a0aec0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span>By {recommendedBlog.author}</span>
                        <span>{formatDate(recommendedBlog.created_at).split(',')[0]}</span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-recommendations">
                <p style={{ color: '#718096', fontSize: '0.875rem' }}>
                  No related blogs found in this category yet.
                </p>
                <Link 
                  to="/create" 
                  className="btn btn-sm btn-primary" 
                  style={{ 
                    marginTop: '1rem',
                    fontSize: '0.875rem',
                    padding: '0.5rem 1rem'
                  }}
                >
                  Write a Blog
                </Link>
              </div>
            )}

            {/* Category Link */}
            {blog.category_name && (
              <div style={{ marginTop: '2rem' }}>
                <Link 
                  to={`/category/${blog.category_id}`}
                  className="btn btn-outline"
                  style={{ 
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '0.875rem'
                  }}
                >
                  More {blog.category_name} Blogs →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;