import React from 'react';
import { deleteProduct } from '../services/productApi';
import './AdminManagementPanel.css';

export default function AdminManagementPanel({ postedProducts, onOpenPostProduct, onClose, onEditProduct, onDeleteProduct }) {
  const handleDeleteClick = async (productId) => {
    try {
      await deleteProduct(productId);
      onDeleteProduct(productId);
    } catch (error) {
      console.warn('Product deletion via backend failed, using local state:', error);
      onDeleteProduct(productId);
    }
  };

  return (
    <section className="admin-management-panel">
      <div className="admin-management-header">
        <div>
          <h2>Manage your posted products</h2>
          <p>Edit or remove the products you have shared with the community.</p>
        </div>
        <div className="admin-management-actions">
          <button type="button" className="action-btn primary" onClick={onOpenPostProduct}>Post New Product</button>
          <button type="button" className="action-btn secondary" onClick={onClose}>Back to Marketplace</button>
        </div>
      </div>

      {postedProducts.length === 0 ? (
        <div className="admin-empty-state">
          <h3>No posted products yet</h3>
          <p>Use the button above to add your first product listing.</p>
        </div>
      ) : (
        <div className="admin-products-list">
          {postedProducts.map((item) => (
            <div key={item.id} className="admin-product-card">
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div className="admin-product-meta">
                  <span>Category: {item.category}</span>
                  <span>Price: ₹{item.pricePerDay}/day</span>
                </div>
              </div>
              <div className="admin-product-actions">
                <button type="button" className="action-btn secondary" onClick={() => onEditProduct(item)}>Edit</button>
                <button type="button" className="action-btn danger" onClick={() => handleDeleteClick(item.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
