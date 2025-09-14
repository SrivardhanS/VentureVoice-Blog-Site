import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlogEditor from '../components/BlogEditor';

const EditBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [blogLoading, setBlogLoading] = useState(true);
  
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const response = await fetch(`/api/blogs/${id}`);
      if (!response.ok) {
        throw new Error('Blog not found');
      }
      const blog = await response.json();
      setTitle(blog.title);
      setContent(blog.content);
      setCategoryId(blog.category_id || '');
      setAuthor(blog.author);
    } catch (err) {
      setError(err.message);
    } finally {
      setBlogLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !author.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category_id: categoryId || null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update blog');
      }

      navigate(`/blog/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (blogLoading) {
    return <div className="loading">Loading blog...</div>;
  }

  return (
    <div className="edit-blog-page">
      <div className="page-header">
        <h1>Edit Blog Post</h1>
        <p>Update your startup insights</p>
      </div>

      {error && <div className="error">{error}</div>}

      <BlogEditor
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        author={author}
        setAuthor={setAuthor}
        onSubmit={handleSubmit}
        submitButtonText={loading ? 'Updating...' : 'Update Blog'}
        isEditing={true}
      />
    </div>
  );
};

export default EditBlog;