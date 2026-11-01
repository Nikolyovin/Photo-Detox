import React, { useCallback, useMemo } from 'react'
import {
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, Alert, ListRenderItemInfo,
} from 'react-native'
import { useTrash, TrashItem } from '../hooks/useTrash'
import { GalleryAsset } from '../types'
import { SPACING, TYPOGRAPHY, ThemeColors } from '../theme'
import { useTheme } from '../theme/ThemeContext'

const { width } = Dimensions.get('window')
const numColumns = 3
const imageSize = width / numColumns

interface TrashScreenProps {
  onBack: () => void
}

const TrashPhoto = React.memo(
  ({ item, onRestore, styles }: { item: TrashItem; onRestore: (photo: GalleryAsset) => void; styles: any }) => (
    <View style={styles.imageWrapper}>
      <Image source={{ uri: item.uri }} style={styles.image} resizeMode="cover" />
      <TouchableOpacity style={styles.restoreButton} onPress={() => onRestore(item.photo)}>
        <Text style={styles.restoreText}>↩</Text>
      </TouchableOpacity>
    </View>
  )
)

export const TrashScreen: React.FC<TrashScreenProps> = ({ onBack }) => {
  const { colors } = useTheme()
  const styles = useMemo(() => createStyles(colors), [colors])
  
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

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<TrashItem>) => (
      <TrashPhoto item={item} onRestore={removeFromTrash} styles={styles} />
    ),
    [removeFromTrash, styles]
  )

  const keyExtractor = useCallback((item: TrashItem, index: number) => item.uri || index.toString(), [])

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
          <View style={styles.placeholder} />
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
          initialNumToRender={15}
          maxToRenderPerBatch={15}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 50 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  backButton: { fontSize: 18, color: colors.primary, fontWeight: '500' },
  headerText: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },
  clearButton: { fontSize: 16, color: colors.danger, fontWeight: '600' },
  placeholder: { width: 60 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { ...TYPOGRAPHY.subtitle, color: colors.textSecondary },
  imageWrapper: { width: imageSize, height: imageSize, padding: 2 },
  image: { width: '100%', height: '100%', borderRadius: 8, backgroundColor: colors.backgroundSecondary },
  restoreButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: colors.overlayDark,
    padding: SPACING.xs,
    borderRadius: 15,
  },
  restoreText: { color: colors.white, fontSize: 14, fontWeight: 'bold' },
})