import React from 'react';
import './Navbar.css';
import { FaBars, FaBell, FaPlus } from 'react-icons/fa';

function Navbar({ searchQuery, setSearchQuery, onSearchTrigger, toggleSidebar, openProfile, openNotifications, openPostProduct, notificationsCount, user }) {
  const displayName = user?.name || 'User';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <header className="navbar">
      <button
        type="button"
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FaBars size={20} />
      </button>

      <div className="logo-area">Green Circle</div>
      <div className="search-bar-container">
        <input 
          type="text" 
          className="search-input"
          placeholder=" Search categories..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-btn" onClick={onSearchTrigger}>search</button>
      </div>
      <div className="navbar-actions">
        <button className="post-product-btn" onClick={openPostProduct} aria-label="Post a new rental product">
          <FaPlus size={18} />
        </button>
        <button className="notification-btn" onClick={openNotifications} aria-label="Open notifications">
          <FaBell size={20} />
          {notificationsCount > 0 && <span className="notification-badge">{notificationsCount}</span>}
        </button>
        <button className="profile-btn" onClick={openProfile} aria-label={`Open profile for ${displayName}`}>
          <span className="avatar">{initials}</span>
          <span className="profile-name">{displayName}</span>
        </button>
      </div>

    </header>
  );
}

export default Navbar;