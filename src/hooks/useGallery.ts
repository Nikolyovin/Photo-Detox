import { useEffect, useState } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { Asset } from '../types'
import { filterPhotos } from '../utils/mediaUtils'

export const useGallery = () => {
  const [allPhotos, setAllPhotos] = useState<Asset[]>([])
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const askPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    if (status === 'granted') {
      setHasPermission(true)
      await loadPhotos()
    } else {
      setIsLoading(false)
    }
  }

  const loadPhotos = async () => {
    setIsLoading(true)
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        first: 500,
        mediaType: 'photo',
        sortBy: 'creationTime',
      })
      setAllPhotos(assets)
    } catch (error) {
      console.error('Ошибка загрузки фото:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    askPermission()
  }, [])

  return {
    allPhotos,
    hasPermission,
    isLoading,
    askPermission,
    // Возвращаем отфильтрованный массив как функцию, чтобы использовать в компоненте
    getFilteredPhotos: (filter: 'all' | 'screenshots') =>
      filterPhotos(allPhotos, filter),
  }
}
