import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogEditor from '../components/BlogEditor';

const CreateBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !author.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category_id: categoryId || null,
          author: author.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create blog');
      }

      const newBlog = await response.json();
      navigate(`/blog/${newBlog.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-page">
      <div className="page-header">
        <h1>Write a New Blog Post</h1>
        <p>Share your startup insights with the community</p>
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
        submitButtonText={loading ? 'Publishing...' : 'Publish Blog'}
      />
    </div>
  );
};

export default CreateBlog;