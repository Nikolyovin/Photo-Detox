import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Asset } from '../types'
import * as LegacyMediaLibrary from 'expo-media-library/legacy'

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

  const addToTrash = async (photo: Asset) => {
    try {
      let photoUri = (photo as any).uri;
      if (!photoUri && typeof (photo as any).getUri === 'function') {
        photoUri = await (photo as any).getUri();
      }

      const newItem: TrashItem = { 
        photo, 
        uri: photoUri || '', 
        deletedAt: Date.now() 
      }
      
      const newTrash = [newItem, ...trash]
      await saveTrash(newTrash)
    } catch (e) {
      console.error('Ошибка при добавлении в корзину', e)
    }
  }

  const removeFromTrash = (photoId: string) => {
    const newTrash = trash.filter((item) => {
      const photo = item.photo as any;
      const id = photo.id || (photo.nativeAsset && photo.nativeAsset.id);
      return id !== photoId;
    });
    saveTrash(newTrash)
  }

  const emptyTrash = async () => {
    try {
      // Надежно достаем ID из объектов (на случай, если новый API их прячет)
      const assetIds = trash.map((item) => {
        const photo = item.photo as any;
        return photo.id || (photo.nativeAsset && photo.nativeAsset.id);
      }).filter(Boolean); // Убираем undefined

      if (assetIds.length > 0) {
        // Используем legacy API для удаления
        const { status } = await LegacyMediaLibrary.requestPermissionsAsync()
        if (status === 'granted') {
          await LegacyMediaLibrary.deleteAssetsAsync(assetIds as string[])
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