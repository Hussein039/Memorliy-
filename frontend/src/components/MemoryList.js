// frontend/src/components/MemoryList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MemoryCard from './MemoryCard';
import MemoryForm from './memoryForm'; // New tweet-like composer
import { useNavigate } from 'react-router-dom';

function MemoryList({ user }) {
  const [memories, setMemories] = useState([]);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/memories');
      setMemories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      {/* Show the memory composer at the top of the feed */}
      {user ? (
        <MemoryForm />
      ) : (
        <p>Please <a href="/login">login</a> to share a memory.</p>
      )}

      <div className="memory-list">
        {memories.map((memory) => (
          <MemoryCard key={memory._id} memory={memory} />
        ))}
      </div>
    </div>
  );
}

export default MemoryList;
