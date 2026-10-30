import React, { useCallback } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native'
import { GalleryAsset } from '../types' // Используем новый тип с uri
import { COLORS, SPACING, TYPOGRAPHY } from '../theme'

const { width } = Dimensions.get('window')
const numColumns = 3
const imageSize = width / numColumns

interface PhotoGridProps {
  photos: GalleryAsset[]
}

// 1. Выносим элемент списка в отдельный компонент и оборачиваем в React.memo
// Это предотвратит перерисовку всех фото, если изменится только одно
const PhotoItem = React.memo(({ item }: { item: GalleryAsset }) => (
  <View style={styles.imageWrapper}>
    <Image
      source={{ uri: item.uri }}
      style={styles.image}
      resizeMode="cover"
    />
  </View>
))

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  // 2. Кешируем функцию рендера, чтобы FlatList не создавал её заново при каждом рендере
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<GalleryAsset>) => <PhotoItem item={item} />,
    []
  )

  // 3. Кешируем keyExtractor
  const keyExtractor = useCallback(
    (item: GalleryAsset) => item.uri,
    []
  )

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
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      numColumns={numColumns}
      // 4. Добавляем оптимизацию для длинных списков
      initialNumToRender={15} 
      maxToRenderPerBatch={15}
      windowSize={5}
      removeClippedSubviews={true} // Экономит память, отключая рендер за пределами экрана
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
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
  },
  imageWrapper: {
    width: imageSize,
    height: imageSize,
    padding: 1, // Оставляем жесткий отступ в 1px для сетки
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E5E5EA', // Можно вынести в тему как COLORS.placeholder
    borderRadius: 4,
  },
})