import React, { useCallback, useMemo } from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
  ListRenderItemInfo,
} from 'react-native'
import { GalleryAsset } from '../types'
import { SPACING, TYPOGRAPHY, ThemeColors } from '../theme'
import { useTheme } from '../theme/ThemeContext'

const { width } = Dimensions.get('window')
const numColumns = 3
const imageSize = width / numColumns

interface PhotoGridProps {
  photos: GalleryAsset[]
}

// Передаем стили в пропсы, чтобы компонент не зависел от контекста и оставался быстрым
const PhotoItem = React.memo(({ item, styles }: { item: GalleryAsset, styles: any }) => (
  <View style={styles.imageWrapper}>
    <Image
      source={{ uri: item.uri }}
      style={styles.image}
      resizeMode="cover"
    />
  </View>
))

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
  const { colors } = useTheme()
  const styles = useMemo(() => createStyles(colors), [colors])

  // Передаем styles в renderItem, чтобы они обновлялись при смене темы
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<GalleryAsset>) => <PhotoItem item={item} styles={styles} />,
    [styles] 
  )

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
      initialNumToRender={15} 
      maxToRenderPerBatch={15}
      windowSize={5}
      removeClippedSubviews={true}
    />
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...TYPOGRAPHY.body,
    color: colors.textSecondary,
  },
  imageWrapper: {
    width: imageSize,
    height: imageSize,
    padding: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    // В темной теме лучше использовать очень темный серый для заглушки
    backgroundColor: colors.backgroundSecondary, 
    borderRadius: 4,
  },
})