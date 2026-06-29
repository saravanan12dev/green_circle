import React from 'react';
import { deleteOrder, updateOrder } from '../services/orderApi';
import { getOrderStatusLabel } from '../utils/appUtils';
import './OrdersPanel.css';

export default function OrdersPanel({
  ourProductOrders,
  myBookedOrders,
  ordersView,
  setOrdersView,
  closeOrdersView,
  handleEditOrder,
  handleDeleteOrder,
  activeOrderMenuId,
  setActiveOrderMenuId,
}) {
  const handleDeleteClick = async (orderId) => {
    try {
      await deleteOrder(orderId);
      handleDeleteOrder(orderId);
    } catch (error) {
      console.warn('Order deletion via backend failed, using local state:', error);
      handleDeleteOrder(orderId);
    }
  };

  return (
    <section className="orders-panel">
      <div className="cart-header">
        <div>
          <h2>Orders & bookings</h2>
          <p>Track rental requests waiting for approval and your own booking history.</p>
        </div>
        <button type="button" className="action-btn secondary" onClick={closeOrdersView}>Back to Marketplace</button>
      </div>

      <div className="orders-tabs" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={`action-btn ${ordersView === 'our-products' ? 'primary' : 'secondary'}`}
          onClick={() => setOrdersView('our-products')}
        >
          Our Product Orders
        </button>
        <button
          type="button"
          className={`action-btn ${ordersView === 'my-bookings' ? 'primary' : 'secondary'}`}
          onClick={() => setOrdersView('my-bookings')}
        >
          Your Booked Orders
        </button>
      </div>

      {ordersView === 'our-products' ? (
        <>
          <div className="cart-summary-pill">📦 {ourProductOrders.length} customer booking{ourProductOrders.length === 1 ? '' : 's'} for your listed rentals</div>
          {ourProductOrders.length === 0 ? (
            <div className="cart-empty-state">
              <h3>No orders for your products yet</h3>
              <p>Customer bookings will appear here once they request a rental.</p>
            </div>
          ) : (
            <div className="cart-list">
              {ourProductOrders.map((order) => (
                <div key={order.id} className="cart-card">
                  <div>
                    <h3>{order.productTitle || order.rentedName}</h3>
                    <p><strong>Customer:</strong> {order.customerName}</p>
                    <div className="cart-meta">
                      <span>Phone: {order.phone}</span>
                      <span>Address: {order.address || 'Not shared'}</span>
                      <span>Dates: {(order.bookingDates || []).join(', ')}</span>
                    </div>
                    {order.responseMessage && (
                      <p className="cart-meta" style={{ marginTop: '0.35rem', color: '#2563eb' }}>
                        Owner reply: {order.responseMessage}
                      </p>
                    )}
                  </div>
                  <div className="cart-actions">
                    <span className={`order-status ${order.status?.toLowerCase() || 'pending'}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="cart-summary-pill">🛒 {myBookedOrders.length} rental order{myBookedOrders.length === 1 ? '' : 's'} placed by you</div>
          {myBookedOrders.length === 0 ? (
            <div className="cart-empty-state">
              <h3>No bookings made yet</h3>
              <p>Your rental requests will appear here after checkout.</p>
            </div>
          ) : (
            <div className="cart-list">
              {myBookedOrders.map((order) => (
                <div key={order.id} className="cart-card">
                  <div>
                    <h3>{order.productTitle || order.rentedName}</h3>
                    <p>Owner: {order.productOwnerName || 'Owner not shared'}</p>
                    <div className="cart-meta">
                      <span>Phone: {order.phone}</span>
                      <span>Address: {order.address || 'Not shared'}</span>
                      <span>Dates: {(order.bookingDates || []).join(', ')}</span>
                    </div>
                    {order.responseMessage && (
                      <p className="cart-meta" style={{ marginTop: '0.35rem', color: '#2563eb' }}>
                        Owner reply: {order.responseMessage}
                      </p>
                    )}
                  </div>
                  <div className="cart-actions">
                    <span className={`order-status ${order.status?.toLowerCase() || 'pending'}`}>
                      {getOrderStatusLabel(order.status)}
                    </span>
                    <div className="booking-action-menu">
                      <button
                        type="button"
                        className="booking-action-btn"
                        onClick={() => setActiveOrderMenuId((current) => current === order.id ? null : order.id)}
                        aria-label="Open booking actions"
                      >
                        ⋯
                      </button>
                      {activeOrderMenuId === order.id && (
                        <div className="booking-action-menu-panel">
                          <button type="button" onClick={() => handleEditOrder(order)}>Edit rental order</button>
                          <button type="button" onClick={() => handleDeleteOrder(order.id)}>Delete order</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
