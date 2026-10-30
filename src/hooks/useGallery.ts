import { useEffect, useState, useCallback } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { Query, AssetField, MediaType } from 'expo-media-library'
import { File } from 'expo-file-system'
import { GalleryAsset } from '../types'

export const useGallery = () => {
  const [allPhotos, setAllPhotos] = useState<GalleryAsset[]>([])
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 1. Оборачиваем loadPhotos в useCallback, чтобы функция не пересоздавалась
  const loadPhotos = useCallback(async () => {
    setIsLoading(true)
    try {
      const assets = await new Query()
        .eq(AssetField.MEDIA_TYPE, MediaType.IMAGE)
        .limit(500)
        .orderBy({ key: AssetField.CREATION_TIME, ascending: false })
        .exe()

      // 2. Достаем URI без использования any, где это возможно
      const assetsWithUri = await Promise.all(
        assets.map(async (asset) => {
          let uri = (asset as unknown as { uri?: string }).uri
          
          if (!uri && typeof (asset as unknown as { getUri?: () => Promise<string> }).getUri === 'function') {
            uri = await (asset as unknown as { getUri: () => Promise<string> }).getUri()
          }
          
          return { ...asset, uri: uri || '' } as GalleryAsset
        })
      )

      // 3. Фильтруем битые файлы (которых больше нет на диске)
      const validAssets = assetsWithUri.filter((asset) => {
        if (!asset.uri) return false
        try {
          const file = new File(asset.uri)
          return file.exists
        } catch (e) {
          return false
        }
      })

      setAllPhotos(validAssets)
    } catch (error) {
      console.error('Ошибка загрузки фото:', error)
    } finally {
      setIsLoading(false)
    }
  }, []) // Зависимостей нет, функция создается один раз

  // 4. Оборачиваем askPermission и добавляем loadPhotos в зависимости
  const askPermission = useCallback(async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status === 'granted') {
      setHasPermission(true)
      await loadPhotos()
    } else {
      setIsLoading(false)
    }
  }, [loadPhotos])

  // 5. Теперь useEffect знает про askPermission и не будет ругаться на линтер
  useEffect(() => {
    askPermission()
  }, [askPermission])

  return {
    allPhotos,
    hasPermission,
    isLoading,
    askPermission,
    loadPhotos,
    // getFilteredPhotos мы убрали, так как фильтруем прямо в HomeScreen
  }
}