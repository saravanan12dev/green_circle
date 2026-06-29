import React, { useState } from 'react';
import { updateUserProfileImage } from '../services/userApi';
import './ProfileModal.css';

export default function ProfileModal({ user, onClose, onUpdate, onLogout }) {
  const normalizeImageUrl = (url) => {
    const trimmed = (url || '').trim();
    if (!trimmed) return '';
    if (/^(https?:\/\/|\/|data:|blob:)/i.test(trimmed)) {
      return trimmed;
    }
    return `/${trimmed}`;
  };

  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState(normalizeImageUrl(user?.photo || ''));
  const [previewUrl, setPreviewUrl] = useState(normalizeImageUrl(user?.photo || ''));
  const [imageError, setImageError] = useState(false);

  const {
    name = 'Unknown',
    email = 'not-set@example.com',
    phone = '',
    secondaryPhone = '',
    address = '',
    city = '',
    state = '',
    mobile = '',
    phoneNumber = '',
  } = user || {};

  const resolvedPhone = phone || mobile || phoneNumber || '';
  const resolvedAddress = address || [city, state].filter(Boolean).join(', ');
  const displayPhoto = previewUrl || normalizeImageUrl(user?.photo || '');
  const mapQuery = resolvedAddress && encodeURIComponent(resolvedAddress);

  const handlePhotoUrlChange = (e) => {
    const rawUrl = e.target.value;
    setPhotoUrl(rawUrl);
    setPreviewUrl(normalizeImageUrl(rawUrl));
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleSavePhoto = async () => {
    const normalizedPhotoUrl = normalizeImageUrl(photoUrl);
    if (!normalizedPhotoUrl) {
      alert('Please enter a valid image URL');
      return;
    }
    if (imageError) {
      alert('Image failed to load. Please check the URL and try again.');
      return;
    }
    try {
      if (user?.id) {
        await updateUserProfileImage(user.id, normalizedPhotoUrl);
      }
      setIsEditingPhoto(false);
      onUpdate?.({ ...user, photo: normalizedPhotoUrl });
    } catch (error) {
      console.warn('Profile image update failed:', error);
      setIsEditingPhoto(false);
      onUpdate?.({ ...user, photo: normalizedPhotoUrl });
    }
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="profile-header">
          <div className="profile-photo">
            {displayPhoto && !imageError ? (
              <img src={displayPhoto} alt="profile" onError={handleImageError} />
            ) : (
              <div className="photo-placeholder">{name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</div>
            )}
          </div>
          <div>
            <h3>{name}</h3>
            <p className="muted">{email}</p>
            <p className="muted">
              Primary: {resolvedPhone ? <a className="contact-link" href={`tel:${resolvedPhone}`}>{resolvedPhone}</a> : '-'}
            </p>
            {secondaryPhone && (
              <p className="muted">
                Alternate: <a className="contact-link" href={`tel:${secondaryPhone}`}>{secondaryPhone}</a>
              </p>
            )}
          </div>
        </div>

        <div className="profile-actions">
          <button type="button" className="edit-photo-btn" onClick={() => setIsEditingPhoto((prev) => !prev)}>
            {isEditingPhoto ? 'Cancel' : 'Change Photo'}
          </button>
          <button
            type="button"
            className="logout-btn"
            onClick={() => {
              onLogout?.();
              onClose?.();
            }}
          >
            Logout
          </button>
          {isEditingPhoto && (
            <div className="photo-edit-panel">
              <input
                type="text"
                placeholder="Enter photo URL, filename, or public path"
                value={photoUrl}
                onChange={handlePhotoUrlChange}
              />
              <p className="input-help">Examples: saravanan.jpeg, profileimg/avatar.jpg, https://example.com/image.jpg</p>
              {photoUrl && (
                <div className="image-preview-area">
                  <p className="preview-label">Preview:</p>
                  {!imageError ? (
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="image-preview"
                      onError={handleImageError}
                      onLoad={handleImageLoad}
                    />
                  ) : (
                    <div className="preview-error">❌ Image failed to load. Check URL and try again.</div>
                  )}
                </div>
              )}
              <button 
                type="button" 
                className="save-photo-btn" 
                onClick={handleSavePhoto}
                disabled={imageError}
              >
                Save Photo
              </button>
            </div>
          )}
        </div>

        <div className="profile-body">
          <h4>Address</h4>
          {resolvedAddress ? (
            <div className="address-block">
              <a
                className="address-link"
                href={mapQuery ? `https://www.google.com/maps/search/?api=1&query=${mapQuery}` : '#'}
                target="_blank"
                rel="noreferrer"
              >
                {resolvedAddress}
              </a>
            </div>
          ) : (
            <p>Not provided</p>
          )}
        </div>
      </div>
    </div>
  );
}
