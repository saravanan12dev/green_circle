import { jsonRequest } from './api';

export const exploreProducts = async ({ lat = 13.0012, lon = 80.2565, radius = 5.0 } = {}) => {
  const products = await jsonRequest(`/api/home/explore?lat=${lat}&lon=${lon}&radius=${radius}`);
  return products.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    category: item.category,
    pricePerDay: item.pricePerDay,
    depositAmount: item.depositAmount,
    imageUrl: item.imageUrl || '',
    distance: item.distance || 0,
    adminName: item.ownerName || item.owner || 'Marketplace',
    isActive: true,
  }));
};
