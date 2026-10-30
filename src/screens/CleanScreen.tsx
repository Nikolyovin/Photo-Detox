import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'
import { SwipeCard } from '../components/SwipeCard'
import { Asset } from '../types'
import { useTrash } from '../hooks/useTrash'
import { COLORS, SHADOWS } from '../theme'

const { width } = Dimensions.get('window')

interface CleanScreenProps {
  initialPhotos: Asset[]
  onFinish: () => void
}

export const CleanScreen: React.FC<CleanScreenProps> = ({
  initialPhotos,
  onFinish,
}) => {
  const [photos, setPhotos] = useState<Asset[]>(
    initialPhotos.filter((p) => p != null),
  )
  const { addToTrash, removeFromTrash } = useTrash()

  // Состояния для Undo-плашки
  const [lastDeleted, setLastDeleted] = useState<Asset | null>(null)
  const [showUndo, setShowUndo] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Анимация выезда плашки (снизу вверх)
  const undoPosition = useSharedValue(150) // Изначально скрыта внизу

  useEffect(() => {
    undoPosition.value = withTiming(showUndo ? 0 : 150, { duration: 300 })
  }, [showUndo])

  const undoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: undoPosition.value }],
  }))

  const handleSwipeLeft = () => {
    const currentPhoto = photos[0]
    if (!currentPhoto) return

    // Сохраняем для Undo и отправляем в корзину
    setLastDeleted(currentPhoto)
    addToTrash(currentPhoto)
    setPhotos((prev) => prev.slice(1))

    // Показываем плашку и запускаем таймер на 3 секунды
    setShowUndo(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setShowUndo(false)
    }, 3000)
  }

  const handleSwipeRight = () => {
    setPhotos((prev) => prev.slice(1))
    // Если свайпаем вправо, скрываем плашку Undo
    setShowUndo(false)
  }

  const handleUndo = () => {
    if (!lastDeleted) return

    // Возвращаем фото в начало списка
    setPhotos((prev) => [lastDeleted, ...prev])
    // Удаляем его из корзины
    removeFromTrash(lastDeleted)
    // Прячем плашку
    setShowUndo(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  if (photos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎉 Все разобрано!</Text>
        <TouchableOpacity style={styles.button} onPress={onFinish}>
          <Text style={styles.buttonText}>Вернуться на главную</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onFinish}>
          <Text style={styles.backButton}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Осталось: {photos.length}</Text>
      </View>

      <View style={styles.cardsContainer}>
        {photos.map((photo, index) => {
          if (index > 0) return null
          return (
            <View key={index.toString()} style={styles.cardWrapper}>
              <SwipeCard
                key={(photo as any).uri || index.toString()}
                photo={photo}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            </View>
          )
        })}
      </View>

      {/* Всплывающая плашка Undo */}
      <Animated.View style={[styles.undoSnackbar, undoAnimatedStyle]}>
        <Text style={styles.undoText}>Фото в корзине</Text>
        <TouchableOpacity onPress={handleUndo} style={styles.undoButton}>
          <Text style={styles.undoButtonText}>Отменить</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: { fontSize: 18, color: COLORS.primary, fontWeight: '500' },
  headerText: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
  cardsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: COLORS.textMain,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Стили для Undo-плашки
  undoSnackbar: {
    position: 'absolute',
    bottom: 40, // Отступ от низа экрана
    left: 20,
    right: 20,
    backgroundColor: '#333333', // Темный фон для контраста
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  undoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  undoButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  undoButtonText: {
    color: COLORS.accent, // Зеленый цвет для действия
    fontSize: 16,
    fontWeight: 'bold',
  },
})
