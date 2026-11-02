import { useState, useEffect, useCallback } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { File } from 'expo-file-system'
import { GalleryAsset } from '../types'
import { useSettingsStore } from '../store/useSettingsStore'

const TRASH_KEY = '@photo_detox_trash'
// Удалили константу SEVEN_DAYS_MS

export interface TrashItem {
  photo: GalleryAsset
  deletedAt: number
  uri: string
}

export const useTrash = () => {
  const [trash, setTrash] = useState<TrashItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Получаем срок хранения из настроек
  const trashRetentionDays = useSettingsStore(
    (state) => state.trashRetentionDays,
  )

  const saveTrash = useCallback(async (newTrash: TrashItem[]) => {
    try {
      setTrash(newTrash)
      await AsyncStorage.setItem(TRASH_KEY, JSON.stringify(newTrash))
    } catch (e) {
      console.error('Ошибка сохранения корзины', e)
    }
  }, [])

  const deletePhotosPhysically = useCallback(
    async (itemsToDelete: TrashItem[]) => {
      if (itemsToDelete.length === 0) return

      await Promise.all(
        itemsToDelete.map(async (item) => {
          if (!item.uri) return

          try {
            const file = new File(item.uri)
            if (file.exists) {
              file.delete()
            }
          } catch (error) {
            console.error(`Не удалось удалить файл ${item.uri}:`, error)
          }
        }),
      )
    },
    [],
  )

  const loadTrash = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(TRASH_KEY)
      if (data) {
        const parsedTrash: TrashItem[] = JSON.parse(data)
        const now = Date.now()

        // Вычисляем лимит в миллисекундах на основе настроек
        const maxAgeMs = trashRetentionDays * 24 * 60 * 60 * 1000

        const expiredItems = parsedTrash.filter(
          (item) => now - item.deletedAt > maxAgeMs,
        )
        const validItems = parsedTrash.filter(
          (item) => now - item.deletedAt <= maxAgeMs,
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
    // Добавили trashRetentionDays в зависимости, чтобы при смене настроек логика обновилась
  }, [deletePhotosPhysically, saveTrash, trashRetentionDays])

  useEffect(() => {
    loadTrash()
  }, [loadTrash])

  const addToTrash = useCallback(async (photo: GalleryAsset) => {
    const newItem: TrashItem = {
      photo,
      uri: photo.uri,
      deletedAt: Date.now(),
    }

    setTrash((prevTrash) => {
      const newTrash = [newItem, ...prevTrash]
      AsyncStorage.setItem(TRASH_KEY, JSON.stringify(newTrash)).catch(
        console.error,
      )
      return newTrash
    })
  }, [])

  const removeFromTrash = useCallback(async (photoToRemove: GalleryAsset) => {
    setTrash((prevTrash) => {
      const newTrash = prevTrash.filter((item) => item.photo !== photoToRemove)
      AsyncStorage.setItem(TRASH_KEY, JSON.stringify(newTrash)).catch(
        console.error,
      )
      return newTrash
    })
  }, [])

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
