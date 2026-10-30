import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useGallery } from './src/hooks/useGallery'
import { HomeScreen } from './src/screens/HomeScreen'
import { CleanScreen } from './src/screens/CleanScreen'
import { TrashScreen } from './src/screens/TrashScreen'
import { OnboardingScreen } from './src/screens/OnboardingScreen'
import { GalleryAsset } from './src/types' // Используем GalleryAsset
import { COLORS } from './src/theme' // Импортируем цвета

const ONBOARDING_KEY = '@photo_detox_onboarding'

type ScreenState = 'home' | 'cleaning' | 'trash'

export default function App() {
  // Достаем loadPhotos из хука для обновления галереи
  const { allPhotos, hasPermission, isLoading, askPermission, loadPhotos } = useGallery()
  
  const [screen, setScreen] = useState<ScreenState>('home')
  const [photosToClean, setPhotosToClean] = useState<GalleryAsset[]>([])
  
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

  // 1. Проверка онбординга
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY)
        if (value === 'true') {
          setHasSeenOnboarding(true)
        }
      } catch (e) {
        console.error('Ошибка чтения онбординга', e)
      } finally {
        setIsOnboardingLoading(false)
      }
    }
    checkOnboarding()
  }, [])

  // 2. Оборачиваем все функции навигации в useCallback
  const finishOnboarding = useCallback(async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
      setHasSeenOnboarding(true)
    } catch (e) {
      console.error('Ошибка сохранения онбординга', e)
    }
  }, [])

  const handleStartCleaning = useCallback((photos: GalleryAsset[]) => {
    setPhotosToClean(photos)
    setScreen('cleaning')
  }, [])

  const handleFinishCleaning = useCallback(() => {
    setScreen('home')
    loadPhotos() // Обновляем список, чтобы удаленные фото исчезли
  }, [loadPhotos])

  const handleOpenTrash = useCallback(() => {
    setScreen('trash')
  }, [])

  const handleBackFromTrash = useCallback(() => {
    setScreen('home')
    loadPhotos() // Обновляем галерею после выхода из корзины
  }, [loadPhotos])

  // Экран загрузки онбординга
  if (isOnboardingLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  // Экран онбординга (если не проходил)
  if (!hasSeenOnboarding) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <OnboardingScreen onFinish={finishOnboarding} />
      </GestureHandlerRootView>
    )
  }

  // Основное приложение
  return (
    <GestureHandlerRootView style={styles.container}>
      {screen === 'home' && (
        <HomeScreen
          allPhotos={allPhotos}
          isLoading={isLoading}
          hasPermission={hasPermission}
          askPermission={askPermission}
          onStartCleaning={handleStartCleaning}
          onOpenTrash={handleOpenTrash}
        />
      )}

      {screen === 'cleaning' && (
        <CleanScreen
          initialPhotos={photosToClean}
          onFinish={handleFinishCleaning}
          onOpenTrash={handleOpenTrash}
        />
      )}

      {screen === 'trash' && (
        <TrashScreen onBack={handleBackFromTrash} />
      )}
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: COLORS.white // Используем цвет из темы
  },
})