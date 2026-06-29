const safeParseJson = (raw, fallback) => {
  if (raw === null || raw === undefined) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const loadLocalState = (key, fallback) => {
  return safeParseJson(localStorage.getItem(key), fallback);
};

export const saveLocalState = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const removeLocalState = (key) => {
  localStorage.removeItem(key);
};

export const getCartStorageKey = (profile) => {
  const identity = (profile?.email || profile?.name || 'guest').trim().toLowerCase();
  const normalized = identity.replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
  return normalized ? `greenCircleCart_${normalized}` : 'greenCircleCart_guest';
};

export const getOrderStatusLabel = (status) => {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'confirmed' || normalized === 'approved') return 'Confirmed';
  if (normalized === 'rejected') return 'Rejected';
  return 'Waiting for approval';
};

export const normalizeProfile = (profile = {}) => {
  const normalizedAddress = profile.address
    || [profile.city, profile.state].filter(Boolean).join(', ')
    || '';

  const normalizedPhone = profile.phone
    || profile.mobile
    || profile.phoneNumber
    || '';

  return {
    name: profile.name || '',
    email: profile.email || '',
    phone: normalizedPhone,
    secondaryPhone: profile.secondaryPhone || '',
    address: normalizedAddress,
    photo: profile.photo || profile.profileImage || '',
  };
};
