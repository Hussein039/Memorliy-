// frontend/src/components/MemoryFeed.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MemoryForm from './memoryForm';
import MemoryCard from './MemoryCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './MemoryFeed.css';
import FilterBar from './FilterBar';

function MemoryFeed({ user }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const feedRef = useRef(null);
  const location = useLocation();

  const fetchMemories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('http://localhost:5000/api/memories');
      
      // Sort memories with newest first
      const sortedMemories = response.data.sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setMemories(sortedMemories);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching memories:', err);
      setError('Failed to load memories. Please try again later.');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchMemories();
    
    // Set up polling to refresh memories every minute
    const intervalId = setInterval(fetchMemories, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const handleNewMemory = (newMemory) => {
    setMemories([newMemory, ...memories]);
    
    // Scroll to top after adding a new memory with a slight delay
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredMemories = filter === 'all' 
    ? memories 
    : memories.filter(memory => memory.emotion === filter);

  return (
    <div className="memory-feed-container" ref={feedRef}>
      <div className="memory-feed-header">
        <h2>Memory Stream</h2>
        <p>Share and explore moments that matter</p>
      </div>
      
      {location.pathname === '/share' && (
        <>
          {user ? (
            <MemoryForm user={user} onMemoryPosted={handleNewMemory} />
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '30px', 
              background: '#fff', 
              borderRadius: '15px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.06)',
              marginBottom: '30px'
            }}>
              <p>Please <a href="/login" style={{ color: '#a387f7', textDecoration: 'none', fontWeight: 'bold' }}>login</a> to share a memory.</p>
            </div>
          )}
        </>
      )}

      <FilterBar activeFilter={filter} onFilterChange={handleFilterChange} />
      
      <div className="memory-list">
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading memories...</p>
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchMemories}>Try Again</button>
          </div>
        ) : filteredMemories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No memories found</h3>
            {filter !== 'all' ? (
              <p>No memories with the emotion "{filter}" were found. Try a different filter or be the first to share one!</p>
            ) : (
              <p>Looks like no one has shared any memories yet. Be the first to share a moment!</p>
            )}
            {user ? (
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Create a Memory
              </button>
            ) : (
              <p className="login-prompt">Log in to share your memories</p>
            )}
          </div>
        ) : (
          <AnimatePresence>
            {filteredMemories.map(memory => (
              <motion.div
                key={memory._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                layout
              >
                <MemoryCard memory={memory} currentUser={user} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      
      {filteredMemories.length > 5 && (
        <div className="load-more-container">
          <button className="load-more-button">
            Load More Memories
          </button>
        </div>
      )}
    </div>
  );
}

export default MemoryFeed;
