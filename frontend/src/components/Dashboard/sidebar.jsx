import React from 'react';
import './sidebar.css';
// Replaced FaPartyHorn with FaGlassCheers and kept the correct FaBasketballBall
import { 
  FaFolder, 
  FaCar, 
  FaMobileAlt, 
  FaChair, 
  FaCamera, 
  FaHome, 
  FaBasketballBall, 
  FaGlassCheers, 
  FaBox, 
  FaShoppingCart, 
  FaEdit, 
  FaSignOutAlt 
} from 'react-icons/fa';

const categories = [
  { label: 'All', icon: <FaFolder size={18} /> },
  { label: 'Vehicles', icon: <FaCar size={18} /> },
  { label: 'Electronics', icon: <FaMobileAlt size={18} /> },
  { label: 'Furniture', icon: <FaChair size={18} /> },
  { label: 'Camera & Photo', icon: <FaCamera size={18} /> },
  { label: 'Home Appliance', icon: <FaHome size={18} /> },
  { label: 'Sport', icon: <FaBasketballBall size={18} /> },
  { label: 'Event Equipment', icon: <FaGlassCheers size={18} /> }, // Updated here
];

const actions = [
  { label: 'Orders', icon: <FaBox size={18} /> },
  { label: 'My Cart', icon: <FaShoppingCart size={18} /> },
];

export default function Sidebar({ onLogout, activeCategory, onCategorySelect, cartItems = [], onOpenAdminManagement, onCloseAdminManagement, onOpenCartView, onOpenOrdersView }) {
  const handleCategorySelect = (label) => {
    onCategorySelect(label);
    if (onCloseAdminManagement) {
      onCloseAdminManagement();
    }
  };

  const handleQuickAction = (label) => {
    if (label === 'My Cart' && onOpenCartView) {
      onOpenCartView();
      return;
    }
    if (label === 'Orders' && onOpenOrdersView) {
      onOpenOrdersView();
      return;
    }
    if (onCloseAdminManagement) {
      onCloseAdminManagement();
    }
  };

  return (
    <aside className="sidebar">
      <div>
        <div className="sidebar-title">Categories</div>
        <div className="sidebar-group">
          {categories.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`sidebar-item ${activeCategory === item.label ? 'active' : ''}`}
              onClick={() => handleCategorySelect(item.label)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-title">Admin Tools</div>
        <div className="sidebar-group">
          <button type="button" className="sidebar-item" onClick={() => {
            if (onOpenAdminManagement) {
              onOpenAdminManagement();
            }
          }}>
            <span className="sidebar-icon"><FaEdit size={18} /></span>
            <span>Post/Edit</span>
          </button>
        </div>

        <div className="sidebar-title">Quick Access</div>
        <div className="sidebar-group">
          {actions.map((item) => (
            <button key={item.label} type="button" className="sidebar-item" onClick={() => handleQuickAction(item.label)}>
              <span className="sidebar-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="sidebar-cart-block">
          <div className="sidebar-title">My Cart</div>
          <div className="sidebar-empty">
            {cartItems.length === 0 ? 'No saved items yet' : `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} saved`}
          </div>
        </div>

        <button type="button" className="logout-button" onClick={onLogout}>
          <FaSignOutAlt size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}