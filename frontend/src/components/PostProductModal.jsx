import React, { useEffect, useMemo, useState } from 'react';
import { createProduct, updateProduct } from '../services/productApi';
import './PostProductModal.css';

const categoryOptions = [
  'Vehicles',
  'Electronics',
  'Furniture',
  'Camera & Photo',
  'Home Appliance',
  'Sport',
  'Event Equipment',
];

export default function PostProductModal({ user, editingProduct = null, onClose, onSave }) {
  const getInitialForm = () => ({
    title: editingProduct?.title || '',
    description: editingProduct?.description || '',
    category: editingProduct?.category || 'Vehicles',
    pricePerDay: editingProduct?.pricePerDay || '',
    imageUrl: editingProduct?.imageUrl || '',
    availableFrom: editingProduct?.availableFrom || '',
    availableUntil: editingProduct?.availableUntil || '',
    blockedDate: '',
    blockedDates: editingProduct?.blockedDates || [],
  });

  const [form, setForm] = useState(getInitialForm);

  useEffect(() => {
    setForm(getInitialForm());
  }, [editingProduct, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addBlockedDate = () => {
    if (!form.blockedDate) return;
    if (form.blockedDates.includes(form.blockedDate)) return;
    setForm((prev) => ({
      ...prev,
      blockedDates: [...prev.blockedDates, prev.blockedDate],
      blockedDate: '',
    }));
  };

  const removeBlockedDate = (date) => {
    setForm((prev) => ({
      ...prev,
      blockedDates: prev.blockedDates.filter((item) => item !== date),
    }));
  };

  // 1. Get logged-in user from localStorage (or fallback to passed user prop)
const currentUser = JSON.parse(localStorage.getItem('user')) || user;

const productPayload = {
  title: form.title,
  description: form.description,
  category: form.category.toUpperCase(),
  pricePerDay: Number(form.pricePerDay) || 0,
  imageUrl: form.imageUrl,
  distance: Number((Math.random() * 3 + 0.5).toFixed(1)),
  addedByName: currentUser?.name || form.addedByName,
  addedPhone: currentUser?.phone || form.addedPhone,
  addedAddress: form.addedAddress,
  availableFrom: form.availableFrom,
  availableUntil: form.availableUntil,
  blockedDates: form.blockedDates,
  
  // 💡 THIS LINE FIXES THE 400 ERROR:
  owner: {
    id: currentUser?.id
  }
};

    try {
      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, productPayload);
      } else {
        await createProduct(productPayload);
      }
      onSave(productPayload);
      onClose();
    } catch (error) {
      console.warn('Product save failed, using local state:', error);
      onSave(productPayload);
      onClose();
    }
  };

  const fullName = useMemo(() => user?.name || 'Admin', [user]);

  return (
    <div className="post-product-overlay" onClick={onClose}>
      <div className="post-product-modal" onClick={(e) => e.stopPropagation()}>
        <div className="post-product-header">
          <h3>{editingProduct ? 'Edit Rental Product' : 'Post Rental Product'}</h3>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Close post/edit form" title="Close">×</button>
        </div>

        <div className="post-product-admin">
          <div>
            <strong>Admin:</strong> {fullName}
          </div>
          <div>
            <strong>Phone:</strong> {user?.phone || 'N/A'}
          </div>
          <div>
            <strong>Address:</strong> {user?.address || 'N/A'}
          </div>
        </div>

        <form className="post-product-form" onSubmit={handleSubmit}>
          <label>
            Product Name
            <input required name="title" value={form.title} onChange={handleChange} placeholder="Enter product name" />
          </label>

          <label>
            Description
            <textarea required name="description" value={form.description} onChange={handleChange} placeholder="Describe the item" />
          </label>

          <div className="post-product-row">
            <label>
              Category
              <select name="category" value={form.category} onChange={handleChange}>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </label>
            <label>
              Price / day
              <input required name="pricePerDay" type="number" min="1" value={form.pricePerDay} onChange={handleChange} placeholder="₹ per day" />
            </label>
          </div>

          <label>
            Product image URL
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://..." />
          </label>

          <div className="post-product-row">
            <label>
              Available from
              <input required name="availableFrom" type="date" value={form.availableFrom} onChange={handleChange} />
            </label>
            <label>
              Available until
              <input required name="availableUntil" type="date" value={form.availableUntil} onChange={handleChange} />
            </label>
          </div>

          <div className="blocked-dates-panel">
            <div className="blocked-dates-title">Not available dates</div>
            <div className="blocked-date-input-row">
              <input
                name="blockedDate"
                type="date"
                value={form.blockedDate}
                onChange={handleChange}
                placeholder="Select date"
              />
              <button type="button" className="add-date-btn" onClick={addBlockedDate}>
                Add
              </button>
            </div>
            <div className="blocked-date-tags">
              {form.blockedDates.map((date) => (
                <span key={date} className="blocked-date-tag">
                  {date}
                  <button type="button" onClick={() => removeBlockedDate(date)}>✕</button>
                </span>
              ))}
            </div>
          </div>

          <button type="submit" className="post-product-submit">
            {editingProduct ? 'Update Product' : 'Post Product'}
          </button>
        </form>
      </div>
    </div>
  );
}
