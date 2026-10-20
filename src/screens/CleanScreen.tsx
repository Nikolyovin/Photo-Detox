import React, { useState } from 'react'
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native'
import { SwipeCard } from '../components/SwipeCard'
import { Asset } from '../types'

interface CleanScreenProps {
  initialPhotos: Asset[]
  onFinish: () => void // Возврат назад
}

export const CleanScreen: React.FC<CleanScreenProps> = ({
  initialPhotos,
  onFinish,
}) => {
  const [photos, setPhotos] = useState<Asset[]>(initialPhotos)

  // Вызывается, когда свайпнули влево (Удалить)
  const handleSwipeLeft = (photo: Asset) => {
    console.log('Удалить (в корзину):', photo.filename)
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
  }

  // Вызывается, когда свайпнули вправо (Оставить)
  const handleSwipeRight = (photo: Asset) => {
    console.log('Оставить:', photo.filename)
    setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
  }

  // Если фото закончились
  if (photos.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎉 Все разобрано!</Text>
        <Text style={styles.subtitle}>Ты молодец. Пора возвращаться.</Text>
        <TouchableOpacity style={styles.button} onPress={onFinish}>
          <Text style={styles.buttonText}>На главную</Text>
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

      {/* Рендерим только первую карточку, остальные лежат "под ней" */}
      <View style={styles.cardsContainer}>
        {photos.map((photo, index) => {
          // Показываем только первые 2 карточки для производительности
          if (index > 1) return null

          return (
            <View
              key={photo.id}
              style={[
                styles.cardWrapper,
                {
                  zIndex: photos.length - index,
                  transform: [{ scale: 1 - index * 0.05 }],
                },
              ]}
            >
              <SwipeCard
                photo={photo}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
              />
            </View>
          )
        })}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: '500',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWrapper: {
    position: 'absolute', // Карточки друг на друге
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
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
