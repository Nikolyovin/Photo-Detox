// src/utils/mediaUtils.ts
import { Asset } from 'expo-media-library'

export const isScreenshot = (photo: any): boolean => {
  const filename = photo.filename || '';
  if (typeof filename !== 'string') return false;
  return filename.toLowerCase().includes('screenshot') || filename.toLowerCase().includes('screencap');
}

export const filterPhotos = (photos: Asset[], filter: 'all' | 'screenshots'): Asset[] => {
  if (filter === 'all') return photos;
  return photos.filter(isScreenshot);
}