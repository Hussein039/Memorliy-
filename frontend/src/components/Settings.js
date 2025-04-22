import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function SettingsSection({ title, children }) {
  return (
    <div style={{ marginBottom: '30px' }}>
      <h3 style={{ color: '#444', fontSize: '1.3em', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

function SettingsToggle({ label, description, checked, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: '20px' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '500', color: '#444', marginBottom: '3px' }}>{label}</div>
        {description && <div style={{ color: '#888', fontSize: '0.9em' }}>{description}</div>}
      </div>
      <label className="toggle-switch" style={{ 
        position: 'relative', 
        display: 'inline-block',
        width: '48px',
        height: '24px',
        marginLeft: '10px'
      }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ opacity: 0, width: 0, height: 0 }}
        />
        <span style={{
          position: 'absolute',
          cursor: 'pointer',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: checked ? 'var(--purple)' : '#ccc',
          borderRadius: '34px',
          transition: '0.4s',
          '&:before': {
            position: 'absolute',
            content: '""',
            height: '20px',
            width: '20px',
            left: checked ? '24px' : '4px',
            bottom: '2px',
            backgroundColor: 'white',
            borderRadius: '50%',
            transition: '0.4s'
          }
        }}>
          <span style={{
            position: 'absolute',
            content: '""',
            height: '20px',
            width: '20px',
            left: checked ? '24px' : '4px',
            bottom: '2px',
            backgroundColor: 'white',
            borderRadius: '50%',
            transition: '0.4s'
          }}></span>
        </span>
      </label>
    </div>
  );
}

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(true);
  const [publicProfile, setPublicProfile] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  
  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('memorliySettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setDarkMode(settings.darkMode || false);
      setEmailNotifications(settings.emailNotifications !== false);
      setAutoPlay(settings.autoPlay !== false);
      setPublicProfile(settings.publicProfile || false);
      setFontSize(settings.fontSize || 'medium');
    }
  }, []);
  
  const saveSettings = () => {
    const settings = {
      darkMode,
      emailNotifications,
      autoPlay,
      publicProfile,
      fontSize
    };
    localStorage.setItem('memorliySettings', JSON.stringify(settings));
    
    // Apply dark mode if needed
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // A nice toast notification would be good here
    alert('Settings saved successfully!');
  };

  return (
    <div className="memory-feed-container">
      <h1 className="page-title">Settings</h1>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="settings-container"
        style={{
          background: '#fff',
          borderRadius: '15px',
          boxShadow: 'var(--card-shadow)',
          padding: '30px'
        }}
      >
        <SettingsSection title="Appearance">
          <SettingsToggle
            label="Dark Mode"
            description="Switch to dark theme for a better night-time experience"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontWeight: '500', color: '#444', marginBottom: '10px' }}>Font Size</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['small', 'medium', 'large'].map(size => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  style={{
                    padding: '8px 16px',
                    background: fontSize === size ? 'var(--purple)' : '#f0f0f0',
                    color: fontSize === size ? 'white' : '#555',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: size === 'small' ? '0.85em' : size === 'large' ? '1.1em' : '0.95em'
                  }}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </SettingsSection>
        
        <SettingsSection title="Privacy">
          <SettingsToggle
            label="Public Profile"
            description="Allow others to view your profile and memories"
            checked={publicProfile}
            onChange={() => setPublicProfile(!publicProfile)}
          />
        </SettingsSection>
        
        <SettingsSection title="Notifications">
          <SettingsToggle
            label="Email Notifications"
            description="Receive email when someone reacts to your memories"
            checked={emailNotifications}
            onChange={() => setEmailNotifications(!emailNotifications)}
          />
        </SettingsSection>
        
        <SettingsSection title="Content Preferences">
          <SettingsToggle
            label="Auto-play Media"
            description="Automatically play videos and animations"
            checked={autoPlay}
            onChange={() => setAutoPlay(!autoPlay)}
          />
        </SettingsSection>
        
        <SettingsSection title="Account Management">
          <div style={{ marginBottom: '20px' }}>
            <button
              onClick={() => setDeleteAccountOpen(!deleteAccountOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: '#f0f0f0',
                color: '#ff6b6b',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              <i className="fas fa-trash-alt"></i> Delete Account
            </button>
            
            {deleteAccountOpen && (
              <div style={{ 
                marginTop: '15px',
                padding: '15px',
                background: '#fff5f5',
                borderRadius: '10px',
                border: '1px solid #ffdddd',
                color: '#ff6b6b'
              }}>
                <p style={{ margin: '0 0 10px' }}>Are you sure you want to delete your account? This action cannot be undone.</p>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => setDeleteAccountOpen(false)}
                    style={{
                      padding: '8px 16px',
                      background: '#f0f0f0',
                      color: '#555',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Here you would handle account deletion
                      alert('Account deletion would be processed here');
                      setDeleteAccountOpen(false);
                    }}
                    style={{
                      padding: '8px 16px',
                      background: '#ff6b6b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </SettingsSection>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
          <button
            onClick={saveSettings}
            style={{
              background: 'var(--purple)',
              color: 'white',
              border: 'none',
              padding: '10px 25px',
              borderRadius: '30px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '1em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 10px rgba(163, 135, 247, 0.3)'
            }}
          >
            <i className="fas fa-save"></i> Save Settings
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default Settings;
