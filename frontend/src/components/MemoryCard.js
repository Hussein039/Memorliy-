// frontend/src/components/MemoryCard.js
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import axios from 'axios';
import './MemoryCard.css';

// Emotion icons and colors mapping
const EMOTIONS = {
  heartwarming: { icon: '❤️', color: '#FF6B6B' },
  sad: { icon: '😢', color: '#6495ED' },
  mysterious: { icon: '🔮', color: '#9370DB' },
  funny: { icon: '😄', color: '#FFD700' },
  regretful: { icon: '😔', color: '#20B2AA' },
  inspiring: { icon: '✨', color: '#32CD32' },
  // Default for any missing emotions
  neutral: { icon: '😐', color: '#A9A9A9' },
};

const MemoryCard = ({ memory, currentUser }) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(memory.likes?.includes(currentUser?._id) || false);
  const [likeCount, setLikeCount] = useState(memory.likes?.length || 0);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(memory.comments || []);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState('');

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  // Format date to a readable format
  const formattedDate = memory.createdAt 
    ? format(new Date(memory.createdAt), 'MMMM d, yyyy • h:mm a')
    : 'Unknown date';

  // Get emotion icon and color, default to neutral if not found
  const emotion = EMOTIONS[memory.emotion?.toLowerCase()] || EMOTIONS.neutral;

  // Truncate text if too long and not expanded
  const isTextLong = memory.text?.length > 250;
  const displayText = !expanded && isTextLong 
    ? `${memory.text.substring(0, 250)}...` 
    : memory.text;

  const handleLike = async () => {
    if (!currentUser || isLiking) return;
    
    setIsLiking(true);
    try {
      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
      
      const token = localStorage.getItem('memorliyToken');
      await axios.post(`http://localhost:5000/api/memories/${memory._id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error('Error liking memory:', err);
      // Revert UI change if API call fails
      setLiked(!liked);
      setLikeCount(liked ? likeCount + 1 : likeCount - 1);
    } finally {
      setIsLiking(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setCommentError('Please log in to comment');
      return;
    }
    
    if (!newComment.trim()) {
      setCommentError('Comment cannot be empty');
      return;
    }
    
    setIsSubmittingComment(true);
    setCommentError('');
    
    try {
      const token = localStorage.getItem('memorliyToken');
      const response = await axios.post(
        `http://localhost:5000/api/memories/${memory._id}/comments`, 
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Add the new comment to the list
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      setCommentError(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const formatCommentDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy • h:mm a');
    } catch (e) {
      return 'Just now';
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('memorliyToken');
      await axios.delete(
        `http://localhost:5000/api/memories/${memory._id}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Remove the deleted comment from the list
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
      alert('Failed to delete comment');
    }
  };

  return (
    <motion.div 
      className="memory-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="memory-card-header">
        <div 
          className="emotion-icon" 
          style={{ backgroundColor: emotion.color }}
        >
          {emotion.icon}
        </div>
        <div className="memory-info">
          <h3>{memory.title || `${memory.emotion || 'Untitled'} Memory`}</h3>
          <p className="timestamp">{formattedDate}</p>
        </div>
      </div>
      
      <div className="memory-content">
        <p>{displayText || "No content"}</p>
        
        {isTextLong && (
          <button 
            className="read-more-btn" 
            onClick={toggleExpand}
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>
      
      {memory.tags && memory.tags.length > 0 && (
        <div className="memory-tags">
          {memory.tags.map((tag, index) => (
            <span key={index} className="tag">#{tag}</span>
          ))}
        </div>
      )}
      
      <div className="memory-card-footer">
        <div className="memory-actions">
          <button 
            className={`action-btn ${liked ? 'active' : ''}`} 
            onClick={handleLike}
            disabled={!currentUser}
          >
            <span className="icon">❤️</span>
            {likeCount > 0 && <span className="count">{likeCount}</span>}
          </button>
          <button 
            className={`action-btn ${showComments ? 'active' : ''}`}
            onClick={toggleComments}
          >
            <span className="icon">💬</span>
            {comments.length > 0 && <span className="count">{comments.length}</span>}
          </button>
          {currentUser && memory.userId === currentUser._id && (
            <button className="action-btn delete">
              <span className="icon">🗑️</span>
            </button>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {showComments && (
          <motion.div 
            className="comments-section"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h4 className="comments-header">
              {comments.length > 0 ? `Comments (${comments.length})` : 'No comments yet'}
            </h4>
            
            {currentUser ? (
              <form className="comment-form" onSubmit={handleSubmitComment}>
                <textarea 
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isSubmittingComment}
                  rows={2}
                />
                {commentError && <p className="comment-error">{commentError}</p>}
                <button 
                  type="submit" 
                  className="comment-submit" 
                  disabled={isSubmittingComment || !newComment.trim()}
                >
                  {isSubmittingComment ? 'Posting...' : 'Post'}
                </button>
              </form>
            ) : (
              <p className="login-to-comment">Please <a href="/login">log in</a> to comment</p>
            )}
            
            <div className="comments-list">
              {comments.map((comment, index) => (
                <div key={index} className="comment">
                  <div className="comment-header">
                    <span className="comment-author">{comment.username || 'Anonymous'}</span>
                    <span className="comment-date">{formatCommentDate(comment.createdAt)}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  {currentUser && (currentUser._id === comment.userId || currentUser._id === memory.userId) && (
                    <button 
                      className="delete-comment" 
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      <span className="icon small">🗑️</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MemoryCard;
