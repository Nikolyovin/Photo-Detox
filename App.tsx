import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useGallery } from './src/hooks/useGallery'
import { HomeScreen } from './src/screens/HomeScreen'
import { CleanScreen } from './src/screens/CleanScreen'
import { TrashScreen } from './src/screens/TrashScreen'
import { OnboardingScreen } from './src/screens/OnboardingScreen'
import { GalleryAsset } from './src/types'
import { ThemeProvider, useTheme } from './src/theme/ThemeContext' // Импортируем useTheme

const ONBOARDING_KEY = '@photo_detox_onboarding'

type ScreenState = 'home' | 'cleaning' | 'trash'

// 1. Выносим всю логику в AppContent, чтобы иметь доступ к useTheme()
const AppContent = () => {
  const { colors } = useTheme() // Получаем цвета текущей темы
  const { allPhotos, hasPermission, isLoading, askPermission, loadPhotos } = useGallery()
  
  const [screen, setScreen] = useState<ScreenState>('home')
  const [photosToClean, setPhotosToClean] = useState<GalleryAsset[]>([])
  
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

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
    loadPhotos()
  }, [loadPhotos])

  const handleOpenTrash = useCallback(() => {
    setScreen('trash')
  }, [])

  const handleBackFromTrash = useCallback(() => {
    setScreen('home')
    loadPhotos()
  }, [loadPhotos])

  // Экран загрузки онбординга (цвета берем из темы)
  if (isOnboardingLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  // Экран онбординга
  if (!hasSeenOnboarding) {
    return <OnboardingScreen onFinish={finishOnboarding} />
  }

  // Основное приложение
  return (
    <>
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
    </>
  )
}

// 2. Главный App теперь просто обертка для провайдеров
export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
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
    alignItems: 'center'
    // backgroundColor убрали отсюда, теперь он динамический выше
  },
})