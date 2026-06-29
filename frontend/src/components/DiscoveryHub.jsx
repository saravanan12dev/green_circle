import React from 'react';
import './DiscoveryHub.css';

function DiscoveryHub({ products, currentUser, onInitiateLease, onAddToCart, onRentNow, onEditProduct, onDeleteProduct, activeSearchTerm = '', cartCount = 0, cartMessage = '' }) {
  const marketplaceProducts = (products || []).filter((item) => item.isActive !== false);

  const renderProductCard = (item, isOwnedByUser = false) => {
    const matches = activeSearchTerm && (
      item.title.toLowerCase().includes(activeSearchTerm.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(activeSearchTerm.toLowerCase())
    );

    return (
      <div key={item.id} className={`product-card ${matches ? 'highlight' : ''}`}>
        <div className="product-image">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.title} />
          ) : null}
          <div className="image-overlay">
            {item.category}
          </div>
        </div>
        <div className="product-details">
          <div className="price-tag">₹{item.pricePerDay}/day</div>
          <h4 style={{ margin: '0.4rem 0', fontSize: '1.15rem' }}>{item.title}</h4>
          <p style={{ margin: '0', fontSize: '0.85rem', color: '#64748b', minHeight: '38px' }}>
            {item.description}
          </p>
          {item.adminName && !isOwnedByUser && (
            <div className="owner-badge">🧑‍💼 Posted by {item.adminName}</div>
          )}
          {isOwnedByUser && (
            <div className="owner-badge">🛠️ Your listed product</div>
          )}
          <div className="distance-tag">
            📍 Proximity: {parseFloat(item.distance || 0).toFixed(1)} km away
          </div>
          {item.availableFrom && item.availableUntil && (
            <div className="availability-tag">
              🗓 Available: {item.availableFrom} → {item.availableUntil}
            </div>
          )}
          {item.blockedDates?.length > 0 && (
            <div className="blocked-dates-summary" style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.4rem' }}>
              Unavailable: {item.blockedDates.join(', ')}
            </div>
          )}
          <div className="product-actions">
            {!isOwnedByUser && (
              <>
                <button className="action-btn secondary" onClick={() => onAddToCart(item)}>
                  Add Cart
                </button>
                <button className="action-btn primary" onClick={() => onRentNow(item)}>
                  Rent Now
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
        <h3>No hyperlocal matching items identified.</h3>
        <p>Ensure your local database contains products tracking within your 5.0km radius filter boundary.</p>
      </div>
    );
  }

  return (
    <section>
      {cartMessage && <div className="cart-status-banner">{cartMessage}</div>}
      <div className="cart-summary-pill">🛒 Cart: {cartCount} saved item{cartCount === 1 ? '' : 's'}</div>

      <section className="listing-section">
        <div className="section-header">
          <h3>Marketplace products</h3>
          <p>Browse available rentals from nearby owners.</p>
        </div>
        <div className="product-grid">
          {marketplaceProducts.map((item) => renderProductCard(item, false))}
        </div>
      </section>
    </section>
  );
}

export default DiscoveryHub;