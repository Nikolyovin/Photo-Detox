import { Asset as ExpoAsset } from 'expo-media-library'

export type FilterType = 'all' | 'screenshots'

// Базовый тип из библиотеки
export type Asset = ExpoAsset

// Наш расширенный тип, в который useGallery добавляет uri
export interface GalleryAsset extends ExpoAsset {
  uri: string
}