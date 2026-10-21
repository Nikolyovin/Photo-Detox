import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Asset } from '../types'
import * as MediaLibrary from 'expo-media-library'

const TRASH_KEY = '@photo_detox_trash'

export interface TrashItem {
  photo: Asset
  deletedAt: number
  uri: string
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

  const addToTrash = (photo: Asset) => {
    const newItem: TrashItem = { photo, deletedAt: Date.now(), uri: photo.uri }
    const newTrash = [newItem, ...trash]
    saveTrash(newTrash)
  }

  const removeFromTrash = (photoId: string) => {
    const newTrash = trash.filter((item) => item.photo.id !== photoId)
    saveTrash(newTrash)
  }

  const emptyTrash = async () => {
    try {
      const assetIds = trash.map((item) => item.photo.id)

      if (assetIds.length > 0) {
        // Запрашиваем разрешение на удаление (для iOS обязательно)
        const { status } = await MediaLibrary.requestPermissionsAsync()
        if (status === 'granted') {
          await MediaLibrary.deleteAssetsAsync(assetIds)
        }
      }

      await saveTrash([])
    } catch (error) {
      console.error('Ошибка при физическом удалении:', error)
      // В случае ошибки (например, отказ в разрешении) корзину не чистим
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
