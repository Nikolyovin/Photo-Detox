import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Asset } from '../types'
import * as MediaLibrary from 'expo-media-library'

const TRASH_KEY = '@photo_detox_trash'

export interface TrashItem {
  photo: Asset
  uri: string // Сохраняем URI отдельно, так как в новых версиях Asset его нет напрямую
  deletedAt: number
}

export const useTrash = () => {
  const [trash, setTrash] = useState<TrashItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadTrash()
  }, [])

  const loadTrash = async () => {
    try {
      const data = await AsyncStorage.getItem(TRASH_KEY)
      if (data) {
        setTrash(JSON.parse(data))
      }
    } catch (e) {
      console.error('Ошибка загрузки корзины', e)
    } finally {
      setIsLoading(false)
    }
  }

  const saveTrash = async (newTrash: TrashItem[]) => {
    try {
      setTrash(newTrash)
      await AsyncStorage.setItem(TRASH_KEY, JSON.stringify(newTrash))
    } catch (e) {
      console.error('Ошибка сохранения корзины', e)
    }
  }

  const addToTrash = async (photo: Asset) => {
    try {
      // В новых версиях expo-media-library URI получается асинхронно
      // Если метод getUri недоступен, используем fallback (на случай старых версий)
      let photoUri = ''
      if (typeof (photo as any).getUri === 'function') {
        photoUri = await (photo as any).getUri()
      } else if ((photo as any).uri) {
        photoUri = (photo as any).uri
      }

      const newItem: TrashItem = {
        photo,
        uri: photoUri,
        deletedAt: Date.now(),
      }

      const newTrash = [newItem, ...trash]
      await saveTrash(newTrash)
    } catch (e) {
      console.error('Ошибка при добавлении в корзину', e)
    }
  }

  const removeFromTrash = async (photoId: string) => {
    const newTrash = trash.filter((item) => item.photo.id !== photoId)
    await saveTrash(newTrash)
  }

  const emptyTrash = async () => {
    try {
      const assetIds = trash.map((item) => item.photo.id)

      if (assetIds.length > 0) {
        const { status } = await MediaLibrary.requestPermissionsAsync()
        if (status === 'granted') {
          await MediaLibrary.deleteAssetsAsync(assetIds)
        }
      }

      await saveTrash([])
    } catch (error) {
      console.error('Ошибка при физическом удалении:', error)
    }
  }

  return {
    trash,
    isLoading,
    addToTrash,
    removeFromTrash,
    emptyTrash,
  }
}
