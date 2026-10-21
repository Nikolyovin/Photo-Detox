// App.tsx
import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useGallery } from './src/hooks/useGallery'
import { HomeScreen } from './src/screens/HomeScreen'
import { CleanScreen } from './src/screens/CleanScreen'
import { TrashScreen } from './src/screens/TrashScreen'
import { Asset } from './src/types'

type ScreenState = 'home' | 'cleaning' | 'trash'

export default function App() {
  const { allPhotos, hasPermission, isLoading, askPermission } = useGallery()

  const [screen, setScreen] = useState<ScreenState>('home')
  const [photosToClean, setPhotosToClean] = useState<Asset[]>([])

  const handleStartCleaning = (photos: Asset[]) => {
    setPhotosToClean(photos)
    setScreen('cleaning')
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
          onOpenTrash={() => setScreen('trash')} // <-- Переход в корзину
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
})
