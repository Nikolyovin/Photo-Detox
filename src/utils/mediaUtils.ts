import { Asset } from 'expo-media-library'

export const isScreenshot = (photo: Asset): boolean => {
  const photoAny = photo as any

  // 1. Самый надежный способ в новом API — проверка медиа-подтипов
  if (photoAny.mediaSubtypes && Array.isArray(photoAny.mediaSubtypes)) {
    // Просто проверяем, есть ли строка 'screenshot' в массиве
    if (photoAny.mediaSubtypes.includes('screenshot')) {
      return true
    }
  }

  // 2. Фолбэк: проверяем URI (на случай, если подтипы не заполнены)
  const path = photoAny.uri || photoAny.localUri || ''
  if (typeof path === 'string') {
    const lowerPath = path.toLowerCase()
    if (lowerPath.includes('screenshot') || lowerPath.includes('screencap')) {
      return true
    }
  }

  // 3. Фолбэк: проверяем filename, если он вдруг доступен напрямую
  if (photoAny.filename && typeof photoAny.filename === 'string') {
    const filename = photoAny.filename.toLowerCase()
    if (filename.includes('screenshot') || filename.includes('screencap')) {
      return true
    }
  }

  return false
}

export const filterPhotos = (
  photos: Asset[],
  filter: 'all' | 'screenshots',
): Asset[] => {
  if (filter === 'all') return photos
  return photos.filter(isScreenshot)
}
