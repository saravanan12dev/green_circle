import { jsonRequest } from './api';

export const createProduct = async (productData) => jsonRequest('/api/products', {
  method: 'POST',
  body: JSON.stringify(productData),
});

export const updateProduct = async (productId, productData) => jsonRequest(`/api/products/${productId}`, {
  method: 'PUT',
  body: JSON.stringify(productData),
});

export const deleteProduct = async (productId) => jsonRequest(`/api/products/${productId}`, {
  method: 'DELETE',
});

export const getProduct = async (productId) => jsonRequest(`/api/products/${productId}`);

export const getAllProducts = async () => jsonRequest('/api/products');
