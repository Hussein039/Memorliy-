import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Profile({ user, setUser }) {
  const [stats, setStats] = useState({
    totalMemories: 0,
    totalReactions: 0,
    joinDate: null
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    avatar: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        avatar: user.avatar || ''
      });
      
      // Fetch user stats
      const fetchStats = async () => {
        try {
          const token = localStorage.getItem('memorliyToken');
          if (!token) return;
          
          // This endpoint would need to be implemented on the backend
          const res = await axios.get('http://localhost:5000/api/users/stats', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setStats({
            totalMemories: res.data.totalMemories || 0,
            totalReactions: res.data.totalReactions || 0,
            joinDate: res.data.joinDate ? new Date(res.data.joinDate) : null
          });
        } catch (err) {
          console.error('Error fetching user stats:', err);
          // Set some default values
          setStats({
            totalMemories: 0,
            totalReactions: 0,
            joinDate: user.createdAt ? new Date(user.createdAt) : new Date()
          });
        }
        setLoading(false);
      };
      
      fetchStats();
    }
  }, [user]);

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('memorliyToken');
      const res = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local storage with new user data
      localStorage.setItem('memorliyUser', JSON.stringify(res.data));
      setUser(res.data);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="memory-feed-container">
        <div className="empty-state" style={{ textAlign: 'center', padding: '50px 20px' }}>
          <i className="fas fa-user-lock" style={{ fontSize: '3em', color: 'var(--purple)', marginBottom: '20px' }}></i>
          <h2>Please log in to view your profile</h2>
          <p>Your profile information will appear here after you log in</p>
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
      <h1 className="page-title">My Account</h1>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <i className="fas fa-spin fa-circle-notch" style={{ fontSize: '2em', marginBottom: '20px' }}></i>
          <p>Loading your profile...</p>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="profile-container"
          style={{
            background: '#fff',
            borderRadius: '15px',
            boxShadow: 'var(--card-shadow)',
            overflow: 'hidden'
          }}
        >
          {/* Cover Photo Area */}
          <div style={{
            height: '160px',
            background: 'linear-gradient(135deg, var(--purple) 0%, #8a6be2 100%)',
            position: 'relative'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '-50px',
              left: '50px',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: user.avatar || '#fff',
              border: '4px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              fontSize: '3em',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              overflow: 'hidden'
            }}>
              {user.avatar ? (
                <img src={user.avatar} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <i className="fas fa-user"></i>
              )}
            </div>
          </div>
          
          {/* Profile Info Section */}
          <div style={{ padding: '60px 30px 30px' }}>
            {!editMode ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{ margin: '0', fontSize: '1.8em', color: '#333' }}>{user.username || 'Username'}</h2>
                  <button 
                    onClick={() => setEditMode(true)}
                    style={{
                      background: 'var(--purple)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '0.9em'
                    }}
                  >
                    <i className="fas fa-edit"></i> Edit Profile
                  </button>
                </div>
                
                <p style={{ color: '#666', marginTop: '5px' }}>{user.email}</p>
                
                <div style={{ margin: '20px 0', padding: '15px', background: '#f7f7f7', borderRadius: '10px' }}>
                  <p style={{ margin: '0', color: '#555' }}>{user.bio || 'No bio yet. Click Edit Profile to add your bio.'}</p>
                </div>
                
                {/* User Stats */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-around', 
                  marginTop: '30px',
                  padding: '20px 0',
                  borderTop: '1px solid #eee',
                  borderBottom: '1px solid #eee'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8em', fontWeight: '600', color: 'var(--purple)' }}>{stats.totalMemories}</div>
                    <div style={{ color: '#888', fontSize: '0.9em' }}>Memories</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8em', fontWeight: '600', color: 'var(--purple)' }}>{stats.totalReactions}</div>
                    <div style={{ color: '#888', fontSize: '0.9em' }}>Reactions</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.8em', fontWeight: '600', color: 'var(--purple)' }}>
                      {stats.joinDate ? stats.joinDate.getFullYear() : new Date().getFullYear()}
                    </div>
                    <div style={{ color: '#888', fontSize: '0.9em' }}>Member Since</div>
                  </div>
                </div>
                
                {/* Quick Links */}
                <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
                  <Link to="/my-memories" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: '#f0f0f0',
                    color: '#555',
                    borderRadius: '30px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.9em'
                  }}>
                    <i className="fas fa-book-open"></i> My Memories
                  </Link>
                  <Link to="/settings" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    background: '#f0f0f0',
                    color: '#555',
                    borderRadius: '30px',
                    textDecoration: 'none',
                    fontWeight: '500',
                    fontSize: '0.9em'
                  }}>
                    <i className="fas fa-cog"></i> Settings
                  </Link>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '500' }}>Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e8e8e8',
                      borderRadius: '10px',
                      fontSize: '1em'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '500' }}>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e8e8e8',
                      borderRadius: '10px',
                      fontSize: '1em'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '500' }}>Bio</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleFormChange}
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e8e8e8',
                      borderRadius: '10px',
                      fontSize: '1em',
                      minHeight: '100px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontWeight: '500' }}>Avatar URL</label>
                  <input
                    type="text"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleFormChange}
                    placeholder="https://example.com/your-image.jpg"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      border: '1px solid #e8e8e8',
                      borderRadius: '10px',
                      fontSize: '1em'
                    }}
                  />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button 
                    type="button"
                    onClick={() => setEditMode(false)}
                    style={{
                      padding: '10px 20px',
                      background: '#f0f0f0',
                      color: '#555',
                      border: 'none',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSaving}
                    style={{
                      padding: '10px 20px',
                      background: 'var(--purple)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '30px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {isSaving ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i> Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Profile;
