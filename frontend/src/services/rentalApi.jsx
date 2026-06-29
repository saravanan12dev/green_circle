import { jsonRequest } from './api';

export const requestHandoffOtp = async (rentalId) => jsonRequest(`/api/rentals/${rentalId}/generate-otp`, {
  method: 'POST',
});

export const verifyHandshake = async (otp) => jsonRequest(`/api/rentals/verify-handshake?otp=${encodeURIComponent(otp)}`, {
  method: 'POST',
});

export const createRental = async (rentalData) => jsonRequest('/api/rentals', {
  method: 'POST',
  body: JSON.stringify(rentalData),
});

export const getRental = async (rentalId) => jsonRequest(`/api/rentals/${rentalId}`);

export const getRentals = async () => jsonRequest('/api/rentals');
