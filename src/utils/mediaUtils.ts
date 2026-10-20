import { Asset } from '../types'

export const isScreenshot = (photo: Asset): boolean => {
  const filename = photo.filename.toLowerCase()
  // Проверяем имя файла
  if (filename.includes('screenshot') || filename.includes('screencap')) {
    return true
  }

  // На Android скриншоты часто лежат в папке с "Screenshots" в URI
  if (photo.uri.toLowerCase().includes('screenshot')) {
    return true
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
