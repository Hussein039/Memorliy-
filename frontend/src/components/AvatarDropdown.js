import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function AvatarDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  const toggleDropdown = () => setOpen(!open);

  return (
    <div className="avatar-dropdown" style={{ position: 'relative', display: 'inline-block' }}>
      <img
        src="https://via.placeholder.com/40"
        alt="Avatar"
        onClick={toggleDropdown}
        style={{ borderRadius: '50%', cursor: 'pointer' }}
      />
      {open && (
        <div
          className="dropdown-menu"
          style={{
            position: 'absolute',
            right: 0,
            top: '45px',
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          {user ? (
            <>
              <Link to="/my-memories" onClick={() => setOpen(false)}>My Memories</Link><br/>
              <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link><br/>
              <Link to="/settings" onClick={() => setOpen(false)}>Settings</Link><br/>
              <button onClick={() => { onLogout(); setOpen(false); }}>Log Out</button>
            </>
          ) : (
            <Link to="/register" onClick={() => setOpen(false)}>Register</Link>
          )}
        </div>
      )}
    </div>
  );
}

export default AvatarDropdown;
