import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Asset } from '../types'
import * as MediaLibrary from 'expo-media-library'

const TRASH_KEY = '@photo_detox_trash'
// Добавили константу (7 дней в миллисекундах)
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000
// const SEVEN_DAYS_MS = 10 * 1000 ВРЕМЕННО ДЛЯ ТЕСТА (10 секунд)

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

  // Сохранение вынесли наверх
  const saveTrash = async (newTrash: TrashItem[]) => {
    try {
      setTrash(newTrash)
      await AsyncStorage.setItem(TRASH_KEY, JSON.stringify(newTrash))
    } catch (e) {
      console.error('Ошибка сохранения корзины', e)
    }
  }

  const loadTrash = async () => {
    try {
      const data = await AsyncStorage.getItem(TRASH_KEY)
      if (data) {
        const parsedTrash: TrashItem[] = JSON.parse(data)
        const now = Date.now()

        // Разделяем фото на просроченные и актуальные
        const expiredItems = parsedTrash.filter(
          (item) => now - item.deletedAt > SEVEN_DAYS_MS,
        )
        const validItems = parsedTrash.filter(
          (item) => now - item.deletedAt <= SEVEN_DAYS_MS,
        )

        // Если есть просроченные фото — удаляем их физически
        if (expiredItems.length > 0) {
          console.log(
            `Найдено ${expiredItems.length} фото старше 7 дней. Удаляем...`,
          )
          try {
            const { status } = await MediaLibrary.requestPermissionsAsync()
            if (status === 'granted') {
              await Promise.all(
                expiredItems.map((item) =>
                  (item.photo as any)
                    .delete()
                    .catch((e: any) => console.warn(e)),
                ),
              )
            }
          } catch (err) {
            console.error('Ошибка автоудаления старых фото:', err)
          }

          // Сохраняем только валидные фото
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
    // Сравниваем объекты по ссылке
    const newTrash = trash.filter((item) => item.photo !== photoToRemove)
    await saveTrash(newTrash)
  }

  const emptyTrash = async () => {
    try {
      if (trash.length > 0) {
        const { status } = await MediaLibrary.requestPermissionsAsync()
        if (status === 'granted') {
          // Вызываем метод delete() у каждого объекта Asset
          await Promise.all(
            trash.map(async (item) => {
              try {
                await (item.photo as any).delete()
              } catch (err) {
                console.warn(`Не удалось удалить фото ${item.photo.id}:`, err)
              }
            }),
          )
        }
      }
      // В любом случае очищаем нашу корзину
      await saveTrash([])
    } catch (error) {
      console.error('Ошибка при физическом удалении:', error)
      // Если что-то пошло не так, очищаем корзину, чтобы не было "битых" фото
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
