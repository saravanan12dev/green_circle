import React from 'react';
import './EditOrderModal.css';

export default function EditOrderModal({ editingOrder, editingOrderDatesText, onClose, onChangeOrder, onChangeDates, onSaveEditedOrder }) {
  const handleFieldChange = (field) => (event) => {
    onChangeOrder({ ...editingOrder, [field]: event.target.value });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="order-edit-modal" onClick={(event) => event.stopPropagation()}>
        <div className="checkout-header">
          <div>
            <p className="checkout-eyebrow">Update booking</p>
            <h3>Edit rental order</h3>
          </div>
          <button type="button" className="checkout-close" onClick={onClose} aria-label="Close edit order">×</button>
        </div>

        <form onSubmit={onSaveEditedOrder}>
          <label>
            Address
            <input
              required
              value={editingOrder.address || ''}
              onChange={handleFieldChange('address')}
              placeholder="Enter your address"
            />
          </label>
          <label>
            Phone
            <input
              required
              value={editingOrder.phone || ''}
              onChange={handleFieldChange('phone')}
              placeholder="Phone number"
            />
          </label>
          <label>
            Booking dates
            <input
              value={editingOrderDatesText}
              onChange={(event) => onChangeDates(event.target.value)}
              placeholder="YYYY-MM-DD, YYYY-MM-DD"
            />
          </label>
          <div className="admin-management-actions">
            <button type="submit" className="action-btn primary">Save changes</button>
            <button type="button" className="action-btn secondary" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
