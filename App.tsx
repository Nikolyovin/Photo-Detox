// App.tsx
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useGallery } from './src/hooks/useGallery'
import { HomeScreen } from './src/screens/HomeScreen'
import { CleanScreen } from './src/screens/CleanScreen'
import { TrashScreen } from './src/screens/TrashScreen'
import { OnboardingScreen } from './src/screens/OnboardingScreen' // <-- Импортируем
import { Asset } from './src/types'

const ONBOARDING_KEY = '@photo_detox_onboarding'

type ScreenState = 'home' | 'cleaning' | 'trash'

export default function App() {
  const { allPhotos, hasPermission, isLoading, askPermission } = useGallery()

  const [screen, setScreen] = useState<ScreenState>('home')
  const [photosToClean, setPhotosToClean] = useState<Asset[]>([])

  // Состояния для Онбординга
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)

  // Проверяем при запуске, проходил ли пользователь онбординг
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

  const finishOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true')
      setHasSeenOnboarding(true)
    } catch (e) {
      console.error('Ошибка сохранения онбординга', e)
    }
  }

  const handleStartCleaning = (photos: Asset[]) => {
    setPhotosToClean(photos)
    setScreen('cleaning')
  }

  // Пока проверяем онбординг, показываем пустой экран или спиннер
  if (isOnboardingLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size='large' color='#007AFF' />
      </View>
    )
  }

  // Если онбординг не пройден, показываем его
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
          onOpenTrash={() => setScreen('trash')}
        />
      )}

      {screen === 'cleaning' && (
        <CleanScreen
          initialPhotos={photosToClean}
          onFinish={() => setScreen('home')}
        />
      )}

      {screen === 'trash' && <TrashScreen onBack={() => setScreen('home')} />}
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
})
