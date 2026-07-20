export const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://green-circle-java.onrender.com';

export const jsonRequest = async (path, options = {}) => {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    const responseBody = await response.text();

    if (responseBody) {
      try {
        const errBody = JSON.parse(responseBody);
        errorMessage = errBody && (errBody.message || errBody.error || JSON.stringify(errBody));
      } catch (e) {
        errorMessage = responseBody;
      }
    }

    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
};
