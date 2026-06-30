import React, { useEffect, useMemo, useRef } from 'react';
import { normalizeImageUrl } from '../utils/appUtils';
import './DiscoveryHub.css';

function DiscoveryHub({ products, currentUser, onInitiateLease, onAddToCart, onRentNow, onEditProduct, onDeleteProduct, activeSearchTerm = '', cartCount = 0, cartMessage = '' }) {
  const marketplaceProducts = (products || []).filter((item) => item.isActive !== false);
  const productRefs = useRef({});

  const matchedProductId = useMemo(() => {
    if (!activeSearchTerm) return null;
    const searchTerm = activeSearchTerm.toLowerCase().trim();
    const foundItem = marketplaceProducts.find((item) => {
      return item.title.toLowerCase().includes(searchTerm)
        || (item.category || '').toLowerCase().includes(searchTerm);
    });
    return foundItem?.id || null;
  }, [activeSearchTerm, marketplaceProducts]);

  useEffect(() => {
    if (!matchedProductId) return;
    const matchedElement = productRefs.current[matchedProductId];
    if (matchedElement?.scrollIntoView) {
      matchedElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  }, [matchedProductId]);

  const renderProductCard = (item, isOwnedByUser = false) => {
    const searchTerm = activeSearchTerm.toLowerCase().trim();
    const matches = searchTerm && (
      item.title.toLowerCase().includes(searchTerm) ||
      (item.category || '').toLowerCase().includes(searchTerm)
    );

    return (
      <div
        ref={(el) => {
          if (matches) {
            productRefs.current[item.id] = el;
          } else {
            delete productRefs.current[item.id];
          }
        }}
        key={item.id}
        className={`product-card ${matches ? 'highlight' : ''}`}
      >
        <div className="product-image">
          {item.imageUrl ? (
            <img
              src={normalizeImageUrl(item.imageUrl)}
              alt={item.title}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = normalizeImageUrl('gearcycle.jpg'); }}
            />
          ) : null}
          <div className="image-overlay">
            {item.category}
          </div>
        </div>
        <div className="product-details">
          <div className="price-tag">₹{item.pricePerDay}/day</div>
          <h4 className="product-title">{item.title}</h4>
          <p className="product-desc">
            {item.description}
          </p>
          {item.adminName && !isOwnedByUser && (
            <div className="owner-badge">🧑‍💼 Posted by {item.adminName}</div>
          )}
          {isOwnedByUser && (
            <div className="owner-badge">🛠️ Your listed product</div>
          )}
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