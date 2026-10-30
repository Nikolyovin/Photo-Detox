import React, { useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  ListRenderItemInfo,
} from 'react-native'
import { useTrash, TrashItem } from '../hooks/useTrash'
import { GalleryAsset } from '../types'
import { COLORS, SPACING, TYPOGRAPHY } from '../theme'

const { width } = Dimensions.get('window')
const numColumns = 3
const imageSize = width / numColumns

interface TrashScreenProps {
  onBack: () => void
}

// 1. Выносим элемент списка в отдельный компонент и оборачиваем в React.memo
const TrashPhoto = React.memo(
  ({ item, onRestore }: { item: TrashItem; onRestore: (photo: GalleryAsset) => void }) => (
    <View style={styles.imageWrapper}>
      <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
      <TouchableOpacity
        style={styles.restoreButton}
        onPress={() => onRestore(item.photo)}
      >
        <Text style={styles.restoreText}>↩</Text>
      </TouchableOpacity>
    </View>
  )
)

export const TrashScreen: React.FC<TrashScreenProps> = ({ onBack }) => {
  const { trash, removeFromTrash, emptyTrash } = useTrash()

  const handleClearTrash = useCallback(() => {
    Alert.alert(
      'Очистить корзину?',
      'Эти фотографии будут удалены из галереи навсегда. Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => emptyTrash() },
      ]
    )
  }, [emptyTrash])

  // 2. Оптимизируем коллбэки для FlatList
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TrashItem>) => (
      <TrashPhoto item={item} onRestore={removeFromTrash} />
    ),
    [removeFromTrash]
  )

  const keyExtractor = useCallback(
    (item: TrashItem, index: number) => item.uri || index.toString(),
    []
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Назад</Text>
        </TouchableOpacity>
        
        <Text style={styles.headerText}>Корзина ({trash.length})</Text>

        {trash.length > 0 ? (
          <TouchableOpacity onPress={handleClearTrash}>
            <Text style={styles.clearButton}>Очистить</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.placeholder} /> // Заглушка, чтобы заголовок не съезжал
        )}
      </View>

      {trash.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Корзина пуста</Text>
        </View>
      ) : (
        <FlatList
          data={trash}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={numColumns}
          // 3. Добавляем оптимизацию для списка
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.white, 
    paddingTop: 50 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  backButton: { 
    fontSize: 18, 
    color: COLORS.primary, 
    fontWeight: '500' 
  },
  headerText: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: COLORS.textMain 
  },
  clearButton: { 
    fontSize: 16, 
    color: COLORS.danger, 
    fontWeight: '600' 
  },
  placeholder: {
    width: 60, // Примерная ширина кнопки "Очистить", чтобы заголовок оставался по центру
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyText: { 
    ...TYPOGRAPHY.subtitle, 
    color: COLORS.textSecondary 
  },
  imageWrapper: {
    width: imageSize,
    height: imageSize,
    padding: 2, // Оставляем жесткий отступ для сетки
  },
  image: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 8,
    backgroundColor: '#E5E5EA', // Серый фон на случай битой картинки
  },
  restoreButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: COLORS.overlayDark, // Используем цвет из темы
    padding: SPACING.xs,
    borderRadius: 15,
  },
  restoreText: { 
    color: COLORS.white, 
    fontSize: 14,
    fontWeight: 'bold'
  },
})