import { useEffect, useState } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { Asset, Query, AssetField, MediaType } from 'expo-media-library'
import { filterPhotos } from '../utils/mediaUtils'
import { File } from 'expo-file-system'

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
      const assets = await new Query()
        .eq(AssetField.MEDIA_TYPE, MediaType.IMAGE)
        .limit(500)
        .orderBy({ key: AssetField.CREATION_TIME, ascending: false })
        .exe()

      // 1. Получаем URI для каждого актива
      const assetsWithUri = await Promise.all(
        assets.map(async (asset) => {
          let uri = (asset as any).uri;
          if (!uri && typeof (asset as any).getUri === 'function') {
            uri = await (asset as any).getUri();
          }
          return { ...asset, uri };
        })
      );

      // 2. Фильтруем битые файлы (которых больше нет на диске)
      const validAssets = assetsWithUri.filter((asset) => {
        if (!asset.uri) return false;
        try {
          const file = new File(asset.uri);
          return file.exists; // Проверяем, существует ли файл
        } catch (e) {
          return false; // Если ошибка — считаем, что файла нет
        }
      });

      setAllPhotos(validAssets as unknown as Asset[])
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
    loadPhotos,
    getFilteredPhotos: (filter: 'all' | 'screenshots') =>
      filterPhotos(allPhotos, filter),
  }
}