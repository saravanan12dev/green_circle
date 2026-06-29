import { jsonRequest } from './api';

export const placeOrder = async (orderData) => jsonRequest('/api/orders', {
  method: 'POST',
  body: JSON.stringify(orderData),
});

export const getOrders = async () => jsonRequest('/api/orders');

export const getOrderById = async (orderId) => jsonRequest(`/api/orders/${orderId}`);

export const updateOrder = async (orderId, orderData) => jsonRequest(`/api/orders/${orderId}`, {
  method: 'PUT',
  body: JSON.stringify(orderData),
});

export const deleteOrder = async (orderId) => jsonRequest(`/api/orders/${orderId}`, {
  method: 'DELETE',
});
