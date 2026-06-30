import React, { useState } from 'react';
import './NotificationModal.css';

export default function NotificationModal({ notifications, onClose, onApprove, onReject, onViewOrder }) {
  const [responseDrafts, setResponseDrafts] = useState({});

  const handleDraftChange = (notificationId, value) => {
    setResponseDrafts((existing) => ({ ...existing, [notificationId]: value }));
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="notification-modal-overlay" onClick={onClose}>
      <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
        <div className="notification-header">
          <div>
            <p className="notification-eyebrow">New requests</p>
            <h3>Rental Requests</h3>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close notifications">✕</button>
        </div>

        {notifications.length === 0 ? (
          <div className="notification-empty">
            <p>No rental requests right now.</p>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.map((note) => (
              <div key={note.id} className={`notification-item ${note.status.toLowerCase()}`}>
                <div className="notification-main">
                  <div className="notification-badge">{note.status}</div>
                  <p className="notification-title">
                    {note.type === 'order-response'
                      ? `Owner replied about your request for ${note.product}`
                      : `${note.customer} wants to rent ${note.product}`}
                  </p>
                  <p className="notification-meta">
                    {note.rentalDays} day{note.rentalDays === 1 ? '' : 's'} · Phone: {note.phone || 'Not shared'}
                  </p>
                  {note.bookingDates?.length > 0 && (
                    <p className="notification-dates">Dates: {note.bookingDates.join(', ')}</p>
                  )}
                  {note.createdAt && (
                    <p className="notification-time">Sent: {formatTimestamp(note.createdAt)}</p>
                  )}
                </div>
                <div className="notification-actions">
                  {note.status === 'Pending' ? (
                    <div className="notification-response-panel">
                      <textarea
                        className="notification-response-textarea"
                        rows="3"
                        placeholder="Add a message for the customer"
                        value={responseDrafts[note.id] || ''}
                        onChange={(event) => handleDraftChange(note.id, event.target.value)}
                      />
                      <div className="notification-action-row">
                        <button type="button" className="reject-btn" onClick={() => onReject(note.id, responseDrafts[note.id] || '')}>
                          Reject
                        </button>
                        <button type="button" className="approve-btn" onClick={() => onApprove(note.id, responseDrafts[note.id] || '')}>
                          Confirm
                        </button>
                      </div>
                    </div>
                  ) : note.status === 'Confirmed' ? (
                    <div className="notification-response-preview">
                      <span className="approved-label">Confirmed</span>
                      {note.responseMessage && <p>{note.responseMessage}</p>}
                      {note.type === 'order-response' && note.orderId && onViewOrder && (
                        <button type="button" className="view-order-btn" onClick={() => onViewOrder(note.orderId)}>
                          View booking in orders
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="notification-response-preview">
                      <span className="rejected-label">Rejected</span>
                      {note.responseMessage && <p>{note.responseMessage}</p>}
                      {note.type === 'order-response' && note.orderId && onViewOrder && (
                        <button type="button" className="view-order-btn" onClick={() => onViewOrder(note.orderId)}>
                          View booking in orders
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
