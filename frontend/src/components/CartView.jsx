import React from 'react';
import './CartView.css';

export default function CartView({ cartItems = [], onClose, onRentNow, onRemoveFromCart }) {
  return (
    <section className="cart-panel">
      <div className="cart-header">
        <div>
          <h2>Your saved cart</h2>
          <p>These are the products you saved for rental.</p>
        </div>
        <button type="button" className="action-btn secondary" onClick={onClose}>Back to Marketplace</button>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty-state">
          <h3>No items in your cart</h3>
          <p>Save products from the marketplace to see them here.</p>
        </div>
      ) : (
        <div className="cart-list">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-card">
              <div>
                <h3>{item.title}</h3>
                <p>{item.description || 'No description provided.'}</p>
                <div className="cart-meta">
                  <span>Category: {item.category}</span>
                  <span>Price: ₹{item.pricePerDay}/day</span>
                </div>
              </div>
              <div className="cart-actions">
                <button
                  type="button"
                  className="action-btn primary"
                  onClick={() => onRentNow(item)}
                >
                  Rent Now
                </button>
                <button
                  type="button"
                  className="action-btn danger"
                  onClick={() => onRemoveFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
