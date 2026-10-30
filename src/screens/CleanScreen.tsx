import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import { SwipeCard } from '../components/SwipeCard'
import { GalleryAsset } from '../types'
import { useTrash } from '../hooks/useTrash'
import { COLORS, SPACING, TYPOGRAPHY } from '../theme'

// Импортируем наши новые компоненты
import { CleanHeader } from '../components/clean/CleanHeader'
import { UndoSnackbar } from '../components/clean/UndoSnackbar'
import { CleanEmptyState } from '../components/clean/CleanEmptyState'

interface CleanScreenProps {
  initialPhotos: GalleryAsset[]
  onFinish: () => void
  onOpenTrash: () => void
}

export const CleanScreen: React.FC<CleanScreenProps> = ({
  initialPhotos,
  onFinish,
  onOpenTrash,
}) => {
  const [photos, setPhotos] = useState<GalleryAsset[]>([])
  const { addToTrash, removeFromTrash, trash, isLoading: isTrashLoading } = useTrash()

  const [lastDeleted, setLastDeleted] = useState<GalleryAsset | null>(null)
  const [showUndo, setShowUndo] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 1. Защелка для инициализации
  const isInitialized = useRef(false)

  const undoPosition = useSharedValue(150)

  useEffect(() => {
    undoPosition.value = withTiming(showUndo ? 0 : 150, { duration: 300 })
  }, [showUndo, undoPosition])

  // 2. Исправленный useEffect фильтрации
  useEffect(() => {
    // Проверяем: корзина загружена и мы еще не инициализировали список
    if (!isTrashLoading && !isInitialized.current) {
      const trashUris = new Set(trash.map((t) => t.uri))
      const availablePhotos = initialPhotos.filter((p) => !trashUris.has(p.uri))
      
      setPhotos(availablePhotos)
      isInitialized.current = true // Ставим защелку
    }
  }, [isTrashLoading, initialPhotos, trash])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const undoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: undoPosition.value }],
  }))

  const handleSwipeLeft = useCallback(() => {
    const currentPhoto = photos[0]
    if (!currentPhoto) return

    setLastDeleted(currentPhoto)
    addToTrash(currentPhoto)
    setPhotos((prev) => prev.slice(1))

    setShowUndo(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setShowUndo(false), 3000)
  }, [photos, addToTrash])

  const handleSwipeRight = useCallback(() => {
    setPhotos((prev) => prev.slice(1))
    setShowUndo(false)
  }, [])

  const handleUndo = useCallback(() => {
    if (!lastDeleted) return

    setPhotos((prev) => [lastDeleted, ...prev])
    removeFromTrash(lastDeleted)
    setShowUndo(false)
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [lastDeleted, removeFromTrash])

  if (isTrashLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.spinnerText}>Проверяем корзину...</Text>
      </View>
    )
  }

  if (photos.length === 0) {
    return (
      <View style={styles.container}>
        <CleanEmptyState onFinish={onFinish} />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <CleanHeader 
        count={photos.length} 
        onFinish={onFinish} 
        onOpenTrash={onOpenTrash} 
      />

      <View style={styles.cardsContainer}>
        <View style={styles.cardWrapper}>
          <SwipeCard
            key={photos[0].uri}
            photo={photos[0]}
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
          />
        </View>
      </View>

      <UndoSnackbar animatedStyle={undoAnimatedStyle} onUndo={handleUndo} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundSecondary, paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  spinnerText: {
    ...TYPOGRAPHY.body,
    marginTop: SPACING.md,
    color: COLORS.textSecondary, 
  },
  cardsContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})