// frontend/src/components/MemoryForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './MemoryForm.css';

function MemoryForm({ user, onMemoryPosted }) {
  const [text, setText] = useState('');
  const [emotion, setEmotion] = useState('');
  const [posting, setPosting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');
  
  const handleTextChange = (e) => {
    setText(e.target.value);
    
    // Auto-expand form if user starts typing
    if (!isExpanded && e.target.value.length > 0) {
      setIsExpanded(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) {
      setError('Please share your memory before posting');
      return;
    }
    
    if (isExpanded && !emotion) {
      setError('Please select an emotion for your memory');
      return;
    }

    setPosting(true);
    setError('');
    
    try {
      const token = localStorage.getItem('memorliyToken');
      if (!token) {
        setError('You must be logged in to post a memory');
        setPosting(false);
        return;
      }
      
      const res = await axios.post(
        'http://localhost:5000/api/memories',
        { text, emotion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Reset form
      setText('');
      setEmotion('');
      setIsExpanded(false);
      
      // Call the callback if provided
      if (onMemoryPosted) onMemoryPosted(res.data);
    } catch (err) {
      console.error('Error posting memory:', err);
      setError(err.response?.data?.message || 'Error posting memory');
    } finally {
      setPosting(false);
    }
  };

  const userAvatar = user?.avatar || null;

  return (
    <div className="compact-memory-form-container">
      <form className="compact-memory-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <div className="user-avatar">
            {userAvatar ? 
              <img src={userAvatar} alt="User" /> : 
              <div className="default-avatar">
                <i className="fas fa-user"></i>
              </div>
            }
          </div>
          
          <div className="form-content">
            <textarea
              placeholder="Share a memory..."
              value={text}
              onChange={handleTextChange}
              onClick={() => setIsExpanded(true)}
              rows={isExpanded ? 3 : 1}
            />
            
            {isExpanded && (
              <div className="extended-options">
                <div className="emotion-selector">
                  <select
                    value={emotion}
                    onChange={(e) => setEmotion(e.target.value)}
                    className={emotion ? emotion.toLowerCase() : ''}
                  >
                    <option value="">Select Emotion</option>
                    <option value="Heartwarming">Heartwarming</option>
                    <option value="Sad">Sad</option>
                    <option value="Mysterious">Mysterious</option>
                    <option value="Funny">Funny</option>
                    <option value="Regretful">Regretful</option>
                    <option value="Inspiring">Inspiring</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <div className="error-message" style={{ color: 'red', margin: '10px 0', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <div className="form-footer">
          <button 
            type="submit" 
            className={`post-button ${posting ? 'posting' : ''}`}
            disabled={!text || posting}
          >
            {posting ? 
              <><i className="fas fa-spinner fa-spin"></i> Posting</> : 
              'Share Memory'
            }
          </button>
        </div>
      </form>
    </div>
  );
}

export default MemoryForm;
