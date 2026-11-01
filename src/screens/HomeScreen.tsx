import React, { useState, useMemo, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { TabBar } from '../components/TabBar'
import { PhotoGrid } from '../components/PhotoGrid'
import { FilterType, GalleryAsset } from '../types'
import { isScreenshot } from '../utils/mediaUtils'
import { LoadingState } from '../components/states/LoadingState'
import { PermissionState } from '../components/states/PermissionState'
import { EmptyState } from '../components/states/EmptyState'
import { SPACING, TYPOGRAPHY, SHADOWS, ThemeColors } from '../theme'
import { useTheme } from '../theme/ThemeContext'
import { TrashButton } from '../components/TrashButton'
import { ThemeToggle } from '../components/ThemeToggle'
import { useTrash } from '../hooks/useTrash'

interface HomeScreenProps {
  allPhotos: GalleryAsset[]
  isLoading: boolean
  hasPermission: boolean
  askPermission: () => void
  onStartCleaning: (photos: GalleryAsset[]) => void
  onOpenTrash: () => void
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  allPhotos,
  isLoading,
  hasPermission,
  askPermission,
  onStartCleaning,
  onOpenTrash,
}) => {
  const { colors } = useTheme()
  const styles = useMemo(() => createStyles(colors), [colors])

  const [activeTab, setActiveTab] = useState<FilterType>('all')
  const { trash, isLoading: isTrashLoading } = useTrash()

  const trashUris = useMemo(() => new Set(trash.map((t) => t.uri)), [trash])
  
  const availablePhotos = useMemo(
    () => allPhotos.filter((photo) => !trashUris.has(photo.uri)), 
    [allPhotos, trashUris]
  )
  
  const displayedPhotos = useMemo(
    () => activeTab === 'all' ? availablePhotos : availablePhotos.filter(isScreenshot), 
    [activeTab, availablePhotos]
  )
  
  const counts = useMemo(() => ({
    total: availablePhotos.length,
    screenshots: availablePhotos.filter(isScreenshot).length
  }), [availablePhotos])

  const handleStartCleaning = useCallback(() => {
    onStartCleaning(displayedPhotos)
  }, [onStartCleaning, displayedPhotos])

  if (isLoading || isTrashLoading) return <LoadingState />
  if (!hasPermission) return <PermissionState onAskPermission={askPermission} />

  return (
    <View style={styles.container}>
      
      {/* --- ШАПКА ЭКРАНА (3 колонки) --- */}
      <View style={styles.topHeader}>
        
        {/* Левая колонка (Тема) */}
        <View style={styles.headerLeft}>
          <ThemeToggle />
        </View>

        {/* Центральная колонка (Заголовок) */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>Галерея</Text>
        </View>

        {/* Правая колонка (Корзина) */}
        <View style={styles.headerRight}>
          <TrashButton onPress={onOpenTrash} />
        </View>

      </View>

      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allCount={counts.total}
        screenshotsCount={counts.screenshots}
      />

      {displayedPhotos.length === 0 ? (
        <EmptyState message={activeTab === 'all' ? 'Нет фотографий' : 'Нет скриншотов'} />
      ) : (
        <PhotoGrid photos={displayedPhotos} />
      )}

      {displayedPhotos.length > 0 && (
        <TouchableOpacity style={styles.fab} onPress={handleStartCleaning} activeOpacity={0.8}>
          <Text style={styles.fabText}>
            Начать разбор ({displayedPhotos.length})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.background, 
    paddingTop: 50 
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    height: 50,
  },
  headerLeft: {
    flex: 1,
    alignItems: 'flex-start', // Прижимаем луну влево
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center', // Центрируем заголовок
    justifyContent: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end', // Прижимаем корзину вправо
  },
  headerTitle: { 
    ...TYPOGRAPHY.title, 
    color: colors.textMain 
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 30,
    ...SHADOWS.medium,
  },
  fabText: { 
    color: colors.white, 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
})