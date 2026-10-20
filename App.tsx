import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useGallery } from './src/hooks/useGallery'
import { HomeScreen } from './src/screens/HomeScreen'
import { CleanScreen } from './src/screens/CleanScreen'
import { Asset } from './src/types'

export default function App() {
  const { allPhotos, hasPermission, isLoading, askPermission } = useGallery()

  const [isCleaning, setIsCleaning] = useState(false)
  const [photosToClean, setPhotosToClean] = useState<Asset[]>([])

  const handleStartCleaning = (photos: Asset[]) => {
    setPhotosToClean(photos)
    setIsCleaning(true)
  }

  const handleFinishCleaning = () => {
    setIsCleaning(false)
    setPhotosToClean([])
    // TODO: Здесь мы позже добавим обновление галереи после удаления
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {isCleaning ? (
        <CleanScreen
          initialPhotos={photosToClean}
          onFinish={handleFinishCleaning}
        />
      ) : (
        <HomeScreen
          allPhotos={allPhotos}
          isLoading={isLoading}
          hasPermission={hasPermission}
          askPermission={askPermission}
          onStartCleaning={handleStartCleaning}
        />
      )}
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
