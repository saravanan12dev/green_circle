import { jsonRequest } from './api';

export const updateUserProfile = async (userId, userData) => jsonRequest(`/api/users/${userId}`, {
  method: 'PUT',
  body: JSON.stringify(userData),
});

export const getUserProfile = async (userId) => jsonRequest(`/api/users/${userId}`);

export const getCurrentUser = async () => jsonRequest('/api/users/me');

export const updateUserProfileImage = async (userId, imageUrl) => jsonRequest(`/api/users/${userId}/profile-image`, {
  method: 'PUT',
  body: JSON.stringify({ profileImage: imageUrl }),
});
