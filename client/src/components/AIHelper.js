import React, { useState } from 'react';
import axios from 'axios';

const AIHelper = ({ currentContent, onContentUpdate, isVisible, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [enhancementType, setEnhancementType] = useState('improve');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEnhanceContent = async () => {
    if (!currentContent && !prompt) {
      setError('Please provide content or a specific prompt');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/gemini/enhance-content', {
        currentContent,
        prompt,
        enhancementType
      });

      onContentUpdate(response.data.enhancedContent);
      setPrompt('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to enhance content');
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="ai-helper-overlay">
      <div className="ai-helper-modal">
        <div className="ai-helper-header">
          <h3>AI Content Assistant</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="ai-helper-content">
          <div className="form-group">
            <label>Enhancement Type:</label>
            <select 
              className="form-control"
              value={enhancementType}
              onChange={(e) => setEnhancementType(e.target.value)}
            >
              <option value="improve">Improve & Polish</option>
              <option value="expand">Expand with Details</option>
              <option value="summarize">Summarize</option>
              <option value="rewrite">Rewrite</option>
              <option value="continue">Continue Writing</option>
            </select>
          </div>

          <div className="form-group">
            <label>Additional Instructions (Optional):</label>
            <textarea
              className="form-control"
              rows="3"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Make it more technical, Add more examples, Focus on SaaS startups, etc."
            />
          </div>

          {error && <div className="error">{error}</div>}

          <div className="ai-helper-actions">
            <button 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleEnhanceContent}
              disabled={loading}
            >
              {loading ? 'Enhancing...' : 'Enhance Content'}
            </button>
          </div>

          {loading && (
            <div className="loading-indicator">
              <div className="spinner"></div>
              <span>AI is working on your content...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIHelper;