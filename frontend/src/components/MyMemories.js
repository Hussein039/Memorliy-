import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MemoryCard from './MemoryCard';
import { motion, AnimatePresence } from 'framer-motion';

function MyMemories({ user }) {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyMemories = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('memorliyToken');
        if (!token) {
          setError("No authentication token found. Please login again.");
          setLoading(false);
          return;
        }
        
        const res = await axios.get('http://localhost:5000/api/memories/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        console.log('Fetched memories:', res.data);
        setMemories(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user memories:', err);
        setError(err.response?.data?.message || "Failed to load your memories");
        setLoading(false);
      }
    };

    fetchMyMemories();
    
    // This component should re-fetch when the user changes or when the auth token changes
    const intervalId = setInterval(() => {
      if (user && localStorage.getItem('memorliyToken')) {
        fetchMyMemories();
      }
    }, 60000); // Refresh every minute
    
    return () => clearInterval(intervalId);
  }, [user]);

  if (!user) {
    return (
      <div className="memory-feed-container">
        <div className="empty-state" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <i className="fas fa-lock" style={{ fontSize: '3em', color: 'var(--purple)', marginBottom: '20px' }}></i>
          <h2>Please log in to view your memories</h2>
          <p>Your personal memories will appear here after you log in</p>
          <a href="/login" className="btn-primary" style={{
            display: 'inline-block',
            background: 'var(--purple)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '30px',
            textDecoration: 'none',
            marginTop: '20px',
            fontWeight: '500'
          }}>Log In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="memory-feed-container">
      <h1 className="page-title">My Memories</h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <i className="fas fa-spin fa-circle-notch" style={{ fontSize: '2em', marginBottom: '20px' }}></i>
          <p>Loading your memories...</p>
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#ff6b6b' }}>
          <i className="fas fa-exclamation-circle" style={{ fontSize: '2em', marginBottom: '20px' }}></i>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: 'var(--purple)',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '30px',
              marginTop: '20px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      ) : memories.length === 0 ? (
        <div className="empty-state" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <i className="fas fa-feather" style={{ fontSize: '3em', color: 'var(--purple)', marginBottom: '20px' }}></i>
          <h2>No memories yet</h2>
          <p>When you share memories, they'll appear here</p>
          <a href="/share" className="btn-primary" style={{
            display: 'inline-block',
            background: 'var(--purple)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '30px',
            textDecoration: 'none',
            marginTop: '20px',
            fontWeight: '500'
          }}>Share a Memory</a>
        </div>
      ) : (
        <AnimatePresence>
          <div className="memory-list">
            {memories.map((memory) => (
              <motion.div
                key={memory._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <MemoryCard memory={memory} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default MyMemories;
