import React, { useState, useEffect, useRef } from 'react'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
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
import { TrashButton } from '../components/TrashButton'

const { width } = Dimensions.get('window')

interface CleanScreenProps {
  initialPhotos: Asset[]
  onFinish: () => void
  onOpenTrash: () => void
}

export const CleanScreen: React.FC<CleanScreenProps> = ({
  initialPhotos,
  onFinish,
  onOpenTrash,
}) => {
  // Изначально массив пустой, заполним его после загрузки корзины
  const [photos, setPhotos] = useState<Asset[]>([])
  
  const { addToTrash, removeFromTrash, trash, isLoading: isTrashLoading } = useTrash()

  // Состояния для Undo-плашки
  const [lastDeleted, setLastDeleted] = useState<Asset | null>(null)
  const [showUndo, setShowUndo] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Анимация выезда плашки (снизу вверх)
  const undoPosition = useSharedValue(150)

  useEffect(() => {
    undoPosition.value = withTiming(showUndo ? 0 : 150, { duration: 300 })
  }, [showUndo])

  // Фильтруем фото, когда корзина загрузится
  useEffect(() => {
    if (!isTrashLoading) {
      // Собираем URI всех фото, которые уже в корзине
      const trashUris = trash.map((t) => t.uri)
      
      // Оставляем только те фото, которых нет в корзине
      const availablePhotos = initialPhotos.filter(
        (p) => p != null && !trashUris.includes((p as any).uri)
      )
      setPhotos(availablePhotos)
    }
  }, [isTrashLoading]) // Срабатывает только когда корзина загрузилась

  const undoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: undoPosition.value }],
  }))

  const handleSwipeLeft = () => {
    const currentPhoto = photos[0]
    if (!currentPhoto) return

    setLastDeleted(currentPhoto)
    addToTrash(currentPhoto)
    setPhotos((prev) => prev.slice(1))

    setShowUndo(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setShowUndo(false)
    }, 3000)
  }

  const handleSwipeRight = () => {
    setPhotos((prev) => prev.slice(1))
    setShowUndo(false)
  }

  const handleUndo = () => {
    if (!lastDeleted) return

    setPhotos((prev) => [lastDeleted, ...prev])
    removeFromTrash(lastDeleted)
    setShowUndo(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }

  // Пока грузится корзина, показываем спиннер
  if (isTrashLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: COLORS.textSecondary }}>
          Проверяем корзину...
        </Text>
      </View>
    )
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
        
        <TrashButton onPress={onOpenTrash} />
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    alignSelf: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Стили для Undo-плашки
  undoSnackbar: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#333333',
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
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: 'bold',
  },
})