import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { File } from 'expo-file-system'
import { GalleryAsset } from '../types'

const TRASH_KEY = '@photo_detox_trash'
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
// const SEVEN_DAYS_MS = 10 * 1000 // ВРЕМЕННО ДЛЯ ТЕСТА

export interface TrashItem {
  photo: GalleryAsset
  deletedAt: number
  uri: string
}

export const useTrash = () => {
  const [trash, setTrash] = useState<TrashItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 1. Сохранение (обернуто в useCallback)
  const saveTrash = useCallback(async (newTrash: TrashItem[]) => {
    try {
      setTrash(newTrash)
      await AsyncStorage.setItem(TRASH_KEY, JSON.stringify(newTrash))
    } catch (e) {
      console.error('Ошибка сохранения корзины', e)
    }
  }, [])

  // 2. Физическое удаление (обернуто в useCallback)
  const deletePhotosPhysically = useCallback(async (itemsToDelete: TrashItem[]) => {
    if (itemsToDelete.length === 0) return

    await Promise.all(
      itemsToDelete.map(async (item) => {
        if (!item.uri) return

        try {
          const file = new File(item.uri)
          if (file.exists) {
            file.delete() // Синхронный метод удаления в новом API
          }
        } catch (error) {
          console.error(`Не удалось удалить файл ${item.uri}:`, error)
        }
      })
    )
  }, [])

  // 3. Загрузка корзины (зависит от saveTrash и deletePhotosPhysically)
  const loadTrash = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(TRASH_KEY)
      if (data) {
        const parsedTrash: TrashItem[] = JSON.parse(data)
        const now = Date.now()

        const expiredItems = parsedTrash.filter(
          (item) => now - item.deletedAt > SEVEN_DAYS_MS
        )
        const validItems = parsedTrash.filter(
          (item) => now - item.deletedAt <= SEVEN_DAYS_MS
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
  }, [deletePhotosPhysically, saveTrash])

  // Запускаем при монтировании
  useEffect(() => {
    loadTrash()
  }, [loadTrash])

  // 4. Добавление в корзину (используем функциональный setTrash, чтобы избежать stale state)
  const addToTrash = useCallback(async (photo: GalleryAsset) => {
    const newItem: TrashItem = {
      photo,
      uri: photo.uri, // Теперь мы уверены, что uri есть!
      deletedAt: Date.now(),
    }

    // Используем функциональное обновление, чтобы не зависеть от старого state
    setTrash((prevTrash) => {
      const newTrash = [newItem, ...prevTrash]
      // Асинхронно сохраняем в память (fire and forget, чтобы не блокировать UI)
      AsyncStorage.setItem(TRASH_KEY, JSON.stringify(newTrash)).catch(console.error)
      return newTrash
    })
  }, [])

  // 5. Восстановление из корзины
  const removeFromTrash = useCallback(async (photoToRemove: GalleryAsset) => {
    setTrash((prevTrash) => {
      const newTrash = prevTrash.filter((item) => item.photo !== photoToRemove)
      AsyncStorage.setItem(TRASH_KEY, JSON.stringify(newTrash)).catch(console.error)
      return newTrash
    })
  }, [])

  // 6. Очистка корзины
  const emptyTrash = useCallback(async () => {
    try {
      if (trash.length > 0) {
        await deletePhotosPhysically(trash)
      }
      await saveTrash([])
    } catch (error) {
      console.error('Ошибка при физическом удалении:', error)
      await saveTrash([])
    }
  }, [trash, deletePhotosPhysically, saveTrash])

  return {
    trash,
    isLoading,
    addToTrash,
    removeFromTrash,
    emptyTrash,
  }
}