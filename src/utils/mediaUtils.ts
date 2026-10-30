import { GalleryAsset } from '../types'

// Расширяем наш базовый тип теми полями, которые могут прийти из нативного API, 
// но не всегда описаны в стандартных типах библиотеки
type ExtendedAsset = GalleryAsset & {
  mediaSubtypes?: string[]
  filename?: string
}

export const isScreenshot = (photo: GalleryAsset): boolean => {
  const extendedPhoto = photo as ExtendedAsset

  // 1. Самый надежный способ в новом API — проверка медиа-подтипов
  if (extendedPhoto.mediaSubtypes && Array.isArray(extendedPhoto.mediaSubtypes)) {
    if (extendedPhoto.mediaSubtypes.includes('screenshot')) {
      return true
    }
  }

  // 2. Фолбэк: проверяем URI (он у нас уже точно есть в GalleryAsset)
  if (extendedPhoto.uri && typeof extendedPhoto.uri === 'string') {
    const lowerPath = extendedPhoto.uri.toLowerCase()
    if (lowerPath.includes('screenshot') || lowerPath.includes('screencap')) {
      return true
    }
  }

  // 3. Фолбэк: проверяем filename, если он доступен напрямую
  if (extendedPhoto.filename && typeof extendedPhoto.filename === 'string') {
    const filename = extendedPhoto.filename.toLowerCase()
    if (filename.includes('screenshot') || filename.includes('screencap')) {
      return true
    }
  }

  return false
}