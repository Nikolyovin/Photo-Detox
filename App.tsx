import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useGallery } from './src/hooks/useGallery'
import { HomeScreen } from './src/screens/HomeScreen'
import { CleanScreen } from './src/screens/CleanScreen'
import { TrashScreen } from './src/screens/TrashScreen'
import { OnboardingScreen } from './src/screens/OnboardingScreen'
import { SettingsScreen } from './src/screens/SettingsScreen' // <-- Добавили импорт
import { GalleryAsset } from './src/types'
import { ThemeProvider, useTheme } from './src/theme/ThemeContext'

const ONBOARDING_KEY = '@photo_detox_onboarding'

// <-- Добавили 'settings' в стейт
type ScreenState = 'home' | 'cleaning' | 'trash' | 'settings'

const AppContent = () => {
  const { colors } = useTheme()
  const { allPhotos, hasPermission, isLoading, askPermission, loadPhotos } =
    useGallery()

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

  // <-- Добавили функции для настроек
  const handleOpenSettings = useCallback(() => {
    setScreen('settings')
  }, [])

  const handleBackFromSettings = useCallback(() => {
    setScreen('home')
  }, [])

  if (isOnboardingLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator size='large' color={colors.primary} />
      </View>
    )
  }

  if (!hasSeenOnboarding) {
    return <OnboardingScreen onFinish={finishOnboarding} />
  }

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
          onOpenSettings={handleOpenSettings} // <-- Передали пропс
        />
      )}

      {screen === 'cleaning' && (
        <CleanScreen
          initialPhotos={photosToClean}
          onFinish={handleFinishCleaning}
          onOpenTrash={handleOpenTrash}
        />
      )}

      {screen === 'trash' && <TrashScreen onBack={handleBackFromTrash} />}

      {screen === 'settings' && (
        <SettingsScreen onBack={handleBackFromSettings} />
      )}
    </>
  )
}

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
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
