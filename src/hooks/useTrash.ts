import { useState, useEffect, useCallback } from 'react'
import { Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as MediaLibrary from 'expo-media-library'
import { File, Paths } from 'expo-file-system' // Используем новый API
import { GalleryAsset } from '../types'
import { useSettingsStore } from '../store/useSettingsStore'

const TRASH_KEY = '@photo_detox_trash'

export interface TrashItem {
  photo: GalleryAsset
  deletedAt: number
  uri: string
}

export const useTrash = () => {
  const [trash, setTrash] = useState<TrashItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
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

      console.log('🔴 [УДАЛЕНИЕ] Версия Android:', Platform.Version)

      // --- Android 11+ ---
      if (Platform.OS === 'android' && Number(Platform.Version) >= 30) {
        console.log('🔴 [УДАЛЕНИЕ] Используем MediaLibrary')

        const assetIds = itemsToDelete
          .map((item) => item.photo.id)
          .filter((id): id is string => !!id)

        if (assetIds.length > 0) {
          try {
            // Пытаемся удалить через MediaLibrary
            await MediaLibrary.deleteAssetsAsync(assetIds)
            console.log('✅ [УДАЛЕНИЕ] MediaLibrary вызван')
          } catch (error: any) {
            // ВЫВОДИМ ОШИБКУ В ALERT, чтобы увидеть на телефоне
            const errorMessage = error?.message || String(error)
            Alert.alert(
              'Ошибка удаления',
              `Не удалось удалить фото на этом устройстве.\n\nКод: ${error?.code || 'unknown'}\n${errorMessage}`,
            )
            console.error('❌ [УДАЛЕНИЕ] Ошибка MediaLibrary:', error)
          }
        }
        return
      }

      // --- Android 10 и ниже ---
      console.log('🔴 [УДАЛЕНИЕ] Используем File API')
      for (const item of itemsToDelete) {
        try {
          if (item.uri) {
            const file = new File(item.uri)
            if (file.exists) {
              file.delete()
              console.log('✅ [УДАЛЕНИЕ] Файл удален:', item.uri)
            }
          }
        } catch (error: any) {
          Alert.alert(
            'Ошибка удаления',
            `Не удалось удалить файл.\n\n${error?.message || String(error)}`,
          )
          console.error('❌ [УДАЛЕНИЕ] Ошибка File API:', error)
        }
      }
    },
    [],
  )

  const loadTrash = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(TRASH_KEY)
      if (data) {
        const parsedTrash: TrashItem[] = JSON.parse(data)
        const now = Date.now()
        const maxAgeMs = trashRetentionDays * 24 * 60 * 60 * 1000

        const expiredItems = parsedTrash.filter(
          (item) => now - item.deletedAt > maxAgeMs,
        )
        const validItems = parsedTrash.filter(
          (item) => now - item.deletedAt <= maxAgeMs,
        )

        if (expiredItems.length > 0) {
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
  }, [deletePhotosPhysically, saveTrash, trashRetentionDays])

  useEffect(() => {
    loadTrash()
  }, [loadTrash])

  const addToTrash = useCallback(async (photo: GalleryAsset) => {
    const newItem: TrashItem = { photo, uri: photo.uri, deletedAt: Date.now() }
    setTrash((prev) => {
      const newTrash = [newItem, ...prev]
      AsyncStorage.setItem(TRASH_KEY, JSON.stringify(newTrash)).catch(
        console.error,
      )
      return newTrash
    })
  }, [])

  const removeFromTrash = useCallback(async (photoToRemove: GalleryAsset) => {
    setTrash((prev) => {
      const newTrash = prev.filter((item) => item.photo.id !== photoToRemove.id)
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

  return { trash, isLoading, addToTrash, removeFromTrash, emptyTrash }
}
