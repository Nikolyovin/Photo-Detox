import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Asset } from '../types'
import * as MediaLibrary from 'expo-media-library'
// import * as FileSystem from 'expo-file-system'
import { File } from 'expo-file-system'

const TRASH_KEY = '@photo_detox_trash'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
// const SEVEN_DAYS_MS = 10 * 1000 // ВРЕМЕННО ДЛЯ ТЕСТА

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

  const saveTrash = async (newTrash: TrashItem[]) => {
    try {
      setTrash(newTrash)
      await AsyncStorage.setItem(TRASH_KEY, JSON.stringify(newTrash))
    } catch (e) {
      console.error('Ошибка сохранения корзины', e)
    }
  }

  // 🔥 ТОЛЬКО FileSystem, никаких Asset.delete()
  const deletePhotosPhysically = async (itemsToDelete: TrashItem[]) => {
  if (itemsToDelete.length === 0) return

  await Promise.all(
    itemsToDelete.map(async (item) => {
      if (!item.uri) {
        console.warn('У фото нет uri, пропускаем:', item.photo.id)
        return
      }

      try {
        // Создаем объект File из сохраненного URI и удаляем его
        const file = new File(item.uri)
        file.delete()
        console.log('Файл удален:', item.uri)
      } catch (error) {
        console.error('Не удалось удалить файл через File API:', error)
      }
    })
  )
}

  const loadTrash = async () => {
    try {
      const data = await AsyncStorage.getItem(TRASH_KEY)
      if (data) {
        const parsedTrash: TrashItem[] = JSON.parse(data)
        const now = Date.now()

        const expiredItems = parsedTrash.filter(
          (item) => now - item.deletedAt > SEVEN_DAYS_MS,
        )
        const validItems = parsedTrash.filter(
          (item) => now - item.deletedAt <= SEVEN_DAYS_MS,
        )

        if (expiredItems.length > 0) {
          console.log(`Найдено ${expiredItems.length} старых фото. Удаляем...`)
          await deletePhotosPhysically(expiredItems)
          await saveTrash(validItems)
        } else {
          setTrash(validItems)
        }
      }
    } catch (e) {
      console.error('Ошибка загрузки корзины', e)
    } finally {
      setIsLoading(false)
    }
  }

  const addToTrash = async (photo: Asset) => {
    try {
      let photoUri = (photo as any).uri
      if (!photoUri && typeof (photo as any).getUri === 'function') {
        photoUri = await (photo as any).getUri()
      }

      const newItem: TrashItem = {
        photo,
        uri: photoUri || '',
        deletedAt: Date.now(),
      }

      const newTrash = [newItem, ...trash]
      await saveTrash(newTrash)
    } catch (e) {
      console.error('Ошибка при добавлении в корзину', e)
    }
  }

  const removeFromTrash = async (photoToRemove: Asset) => {
    const newTrash = trash.filter((item) => item.photo !== photoToRemove)
    await saveTrash(newTrash)
  }

  const emptyTrash = async () => {
    try {
      if (trash.length > 0) {
        await deletePhotosPhysically(trash)
      }
      await saveTrash([])
    } catch (error) {
      console.error('Ошибка при физическом удалении:', error)
      await saveTrash([])
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