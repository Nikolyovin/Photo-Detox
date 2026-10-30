import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useGallery } from './src/hooks/useGallery'
import { HomeScreen } from './src/screens/HomeScreen'
import { CleanScreen } from './src/screens/CleanScreen'
import { TrashScreen } from './src/screens/TrashScreen'
import { OnboardingScreen } from './src/screens/OnboardingScreen'
import { Asset } from './src/types'

const ONBOARDING_KEY = '@photo_detox_onboarding'

type ScreenState = 'home' | 'cleaning' | 'trash'

export default function App() {
  // ВАЖНО: достаем loadPhotos из хука, чтобы обновлять галерею
  const { allPhotos, hasPermission, isLoading, askPermission, loadPhotos } = useGallery()
  
  const [screen, setScreen] = useState<ScreenState>('home')
  const [photosToClean, setPhotosToClean] = useState<Asset[]>([])
  
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

  // ФУНКЦИЯ, КОТОРОЙ НЕ ХВАТАЛО:
  const handleFinishCleaning = () => {
    setScreen('home')
    // Обновляем список фото, чтобы удаленные картинки исчезли с главного экрана
    loadPhotos() 
  }

  if (isOnboardingLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    )
  }

  if (!hasSeenOnboarding) {
    return (
      <GestureHandlerRootView style={styles.container}>
        <OnboardingScreen onFinish={finishOnboarding} />
      </GestureHandlerRootView>
    )
  }

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
          onFinish={handleFinishCleaning}
          onOpenTrash={() => setScreen('trash')} // <-- Убедись, что это есть
        />
      )}

      {screen === 'trash' && (
        <TrashScreen 
          onBack={() => {
            setScreen('home')
            loadPhotos() // Обновляем галерею и после выхода из корзины
          }} 
        />
      )}
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
})