import '@fortawesome/fontawesome-free/css/all.min.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import MemoryFeed from './components/MemoryFeed';
import RandomMemory from './components/RandomMemory';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Settings from './components/Settings';
import MyMemories from './components/MyMemories';
import AvatarDropdown from './components/AvatarDropdown';
import './index.css';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('memorliyUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('memorliyUser');
    localStorage.removeItem('memorliyToken');
    setUser(null);
  };

  return (
    <div className="container">
      <header>
        <div className="header-top">
          <h1>
            <Link to="/" style={{ textDecoration: 'none', color: 'var(--purple)' }}>
              <i className="fas fa-bottle-water" style={{ fontSize: '0.7em', marginRight: '10px', opacity: 0.8 }}></i>
              Memorliy
            </Link>
          </h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/share">Share</Link>
            <Link to="/random">Random</Link>
            {user && <Link to="/my-memories">My Memories</Link>}
          </nav>
          <AvatarDropdown user={user} onLogout={handleLogout} />
        </div>
        <p>Whispers of the past, floating through the internet sea...</p>
      </header>

      <Routes>
        <Route path="/" element={<MemoryFeed user={user} />} />
        <Route path="/share" element={<MemoryFeed user={user} />} />
        <Route path="/random" element={<RandomMemory />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/my-memories" element={<MyMemories user={user} />} />
      </Routes>

      <footer style={{ 
        textAlign: 'center', 
        padding: '30px 0 15px', 
        marginTop: '50px',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        color: '#888',
        fontSize: '0.9em'
      }}>
        <div style={{ marginBottom: '15px' }}>
          <a href="#" style={{ 
            color: 'var(--purple)', 
            margin: '0 10px', 
            fontSize: '1.2em',
            transition: 'transform 0.2s ease'
          }}><i className="fab fa-twitter"></i></a>
          <a href="#" style={{ 
            color: 'var(--purple)', 
            margin: '0 10px', 
            fontSize: '1.2em' 
          }}><i className="fab fa-instagram"></i></a>
          <a href="#" style={{ 
            color: 'var(--purple)', 
            margin: '0 10px', 
            fontSize: '1.2em' 
          }}><i className="fab fa-facebook-f"></i></a>
        </div>
        <p>© 2023 Memorliy. All memories are anonymous and shared with care.</p>
      </footer>
    </div>
  );
}

export default App;
