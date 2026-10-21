import { useEffect, useState } from 'react'
// В версии 18.2.1 старый API лежит прямо в корне
import * as MediaLibrary from 'expo-media-library'
import { Asset } from 'expo-media-library'
import { filterPhotos } from '../utils/mediaUtils'

export const useGallery = () => {
  const [allPhotos, setAllPhotos] = useState<Asset[]>([])
  const [hasPermission, setHasPermission] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const loadPhotos = async () => {
    setIsLoading(true)
    try {
      // Старый метод getAssetsAsync работает в версии 18.2.1
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

  const askPermission = async () => {
    const { status: currentStatus } = await MediaLibrary.getPermissionsAsync()
    if (currentStatus === 'granted') {
      setHasPermission(true)
      await loadPhotos()
      return
    }

    const { status: newStatus } = await MediaLibrary.requestPermissionsAsync()
    if (newStatus === 'granted') {
      setHasPermission(true)
      await loadPhotos()
    } else {
      setHasPermission(false)
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
    getFilteredPhotos: (filter: 'all' | 'screenshots') =>
      filterPhotos(allPhotos, filter),
  }
}
