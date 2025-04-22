import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

function RandomMemory() {
  const [memory, setMemory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    fetchRandomMemory();
  }, []);

  const fetchRandomMemory = async () => {
    try {
      setTransition(true);
      setTimeout(async () => {
        setLoading(true);
        const res = await axios.get('http://localhost:5000/api/memories');
        const allMemories = res.data;
        if (allMemories.length > 0) {
          const randomIndex = Math.floor(Math.random() * allMemories.length);
          setMemory(allMemories[randomIndex]);
        }
        setLoading(false);
        setTransition(false);
      }, 500);
    } catch (err) {
      console.error('Error fetching random memory:', err);
      setLoading(false);
      setTransition(false);
    }
  };

  const handleNext = () => {
    fetchRandomMemory();
  };

  return (
    <div className="random-memory-container">
      <h1 className="page-title">Random Memory</h1>
      
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="loading"
            style={{ 
              fontSize: "1.2em", 
              color: "#888", 
              fontStyle: "italic",
              padding: "40px",
              textAlign: "center" 
            }}
          >
            <i className="fas fa-spin fa-bottle-water" style={{ fontSize: "2em", marginBottom: "20px", display: "block", color: "#a387f7" }}></i>
            Fishing for a memory...
          </motion.div>
        ) : (
          <motion.div
            key={memory?._id || 'no-memory'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className={`random-memory-card ${memory?.emotion}`}
            style={{ 
              opacity: transition ? 0.5 : 1,
              borderLeft: memory ? `4px solid var(--${memory.emotion === 'Heartwarming' ? 'pink' : 
                memory.emotion === 'Sad' ? 'blue' : 
                memory.emotion === 'Mysterious' ? 'lavender' : 
                memory.emotion === 'Funny' ? 'yellow' : 
                memory.emotion === 'Regretful' ? 'green' : 
                memory.emotion === 'Inspiring' ? 'teal' : 'purple'})` : 'none'
            }}
          >
            {memory ? (
              <>
                <span className={`random-memory-emotion ${memory.emotion}`}>
                  {memory.emotion}
                </span>
                
                {memory.title && (
                  <h2 style={{ 
                    color: "#333", 
                    fontFamily: "'Dancing Script', cursive",
                    fontSize: "2.2em",
                    margin: "10px 0 20px"
                  }}>
                    {memory.title}
                  </h2>
                )}
                
                <p className="random-memory-text">
                  "{memory.text}"
                </p>
                
                {memory.image && (
                  <img 
                    src={memory.image} 
                    alt="Memory" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '400px',
                      borderRadius: '12px',
                      margin: '20px auto',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                      display: 'block'
                    }} 
                  />
                )}
                
                <p style={{ 
                  fontSize: "0.9em", 
                  color: "#999", 
                  fontStyle: "italic",
                  marginTop: "20px" 
                }}>
                  {memory.date ? 
                    `A memory from ${new Date(memory.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}` :
                    `Posted on ${new Date(memory.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}`
                  }
                </p>
                
                <div 
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "25px",
                    gap: "15px"
                  }}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Here you would send the reaction to the backend
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.5em",
                      color: "#a387f7",
                      cursor: "pointer",
                      padding: "10px",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <i className="fas fa-heart"></i>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Here you would send the reaction to the backend
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.5em",
                      color: "#a387f7",
                      cursor: "pointer",
                      padding: "10px",
                      transition: "transform 0.2s ease",
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.2)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                  >
                    <i className="fas fa-share"></i>
                  </button>
                </div>
              </>
            ) : (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <i className="fas fa-water" style={{ fontSize: "3em", color: "#a387f7", marginBottom: "20px" }}></i>
                <p style={{ fontSize: "1.2em" }}>No memories found in the sea yet. Be the first to share one!</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="random-memory-nav">
        <Link to="/">
          <button>
            <i className="fas fa-arrow-left"></i> Back to Shore
          </button>
        </Link>
        <button onClick={handleNext} disabled={loading || transition}>
          Next Memory <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default RandomMemory;
