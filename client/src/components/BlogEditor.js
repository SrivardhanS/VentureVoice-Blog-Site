import React, { useState, useEffect } from 'react';
import AIHelper from './AIHelper';

const BlogEditor = ({ 
  title, 
  setTitle, 
  content, 
  setContent, 
  categoryId, 
  setCategoryId, 
  author, 
  setAuthor,
  onSubmit,
  submitButtonText = 'Publish Blog',
  isEditing = false
}) => {
  const [categories, setCategories] = useState([]);
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleAIContentUpdate = (enhancedContent) => {
    setContent(enhancedContent);
    setShowAIHelper(false);
  };

  const handleKeyDown = (e) => {
    // Open AI Helper with Ctrl/Cmd + K
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setShowAIHelper(true);
    }
  };

  return (
    <div className="blog-editor">
      <div className="form-container">
        <div className="form-group">
          <label htmlFor="title">Blog Title *</label>
          <input
            type="text"
            id="title"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an engaging title for your startup blog..."
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="author">Author *</label>
          <input
            type="text"
            id="author"
            className="form-control"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            className="form-control"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <div className="content-header">
            <label htmlFor="content">Blog Content *</label>
            <div className="editor-tools">
              <button
                type="button"
                className="btn btn-ai"
                onClick={() => setShowAIHelper(true)}
                title="AI Assistant (Ctrl+K)"
              >
                🤖 AI Assist
              </button>
            </div>
          </div>
          <textarea
            id="content"
            className="form-control content-editor"
            value={content}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            placeholder="Start writing your blog content here... Press Ctrl+K to get AI assistance!"
            required
            rows="15"
          />
          <div className="editor-help">
            <small>
              💡 Tip: Press <kbd>Ctrl+K</kbd> to open AI assistant for content enhancement
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={!title.trim() || !content.trim() || !author.trim()}
          >
            {submitButtonText}
          </button>
        </div>
      </div>

      <AIHelper
        currentContent={content}
        onContentUpdate={handleAIContentUpdate}
        isVisible={showAIHelper}
        onClose={() => setShowAIHelper(false)}
      />
    </div>
  );
};

export default BlogEditor;