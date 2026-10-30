import React from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native'
import { Asset } from '../types'

const { width } = Dimensions.get('window')
const numColumns = 3
const imageSize = width / numColumns

interface PhotoGridProps {
  photos: Asset[]
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  if (photos.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>В этой категории пусто</Text>
      </View>
    )
  }

  return (
    <FlatList
      data={photos}
      // Используем uri как ключ, с fallback на индекс (если uri вдруг нет)
      keyExtractor={(item, index) => (item as any).uri || index.toString()}
      numColumns={numColumns}
      renderItem={({ item }) => (
        // Оборачиваем в View с серым фоном. Если картинка битая, будет серый квадрат, а не белый
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: (item as any).uri }}
            style={styles.image}
            resizeMode="cover"
            // Если картинка не загрузилась, мы просто ничего не делаем, 
            // и остается серый фон из-под нее
            onError={() => {}}
          />
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  imageWrapper: {
    width: imageSize,
    height: imageSize,
    padding: 1, // Отступ между картинками
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E5EA', // Серый фон для "битых" фото
    borderRadius: 4, // Легкое скругление для красоты
  },
})