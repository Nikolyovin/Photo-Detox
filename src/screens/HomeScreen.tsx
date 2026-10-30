import React, { useState, useMemo, useCallback } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { TabBar } from '../components/TabBar'
import { PhotoGrid } from '../components/PhotoGrid'
import { FilterType, GalleryAsset } from '../types'
import { isScreenshot } from '../utils/mediaUtils'
import { LoadingState } from '../components/states/LoadingState'
import { PermissionState } from '../components/states/PermissionState'
import { EmptyState } from '../components/states/EmptyState'
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from '../theme'
import { TrashButton } from '../components/TrashButton'
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
  const [activeTab, setActiveTab] = useState<FilterType>('all')
  const { trash, isLoading: isTrashLoading } = useTrash()

  // 1. Используем Set для O(1) поиска. И кешируем его, чтобы не пересоздавать при каждом рендере.
  const trashUris = useMemo(() => {
    return new Set(trash.map((t) => t.uri))
  }, [trash])

  // 2. Кешируем список доступных фото (без тех, что в корзине)
  const availablePhotos = useMemo(() => {
    return allPhotos.filter((photo) => !trashUris.has(photo.uri))
  }, [allPhotos, trashUris])

  // 3. Кешируем отфильтрованный список для текущей вкладки
  const displayedPhotos = useMemo(() => {
    if (activeTab === 'all') return availablePhotos
    return availablePhotos.filter(isScreenshot)
  }, [activeTab, availablePhotos])

  // 4. Кешируем подсчет для вкладок
  const counts = useMemo(() => {
    const total = availablePhotos.length
    const screenshots = availablePhotos.filter(isScreenshot).length
    return { total, screenshots }
  }, [availablePhotos])

  // 5. Кешируем обработчик нажатия на кнопку
  const handleStartCleaning = useCallback(() => {
    onStartCleaning(displayedPhotos)
  }, [onStartCleaning, displayedPhotos])

  // Пока грузим галерею или корзину, показываем спиннер
  if (isLoading || isTrashLoading) return <LoadingState />
  
  if (!hasPermission) return <PermissionState onAskPermission={askPermission} />

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Галерея</Text>
        <TrashButton onPress={onOpenTrash} />
      </View>

      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allCount={counts.total}
        screenshotsCount={counts.screenshots}
      />

      {displayedPhotos.length === 0 ? (
        <EmptyState
          message={activeTab === 'all' ? 'Нет фотографий' : 'Нет скриншотов'}
        />
      ) : (
        <PhotoGrid photos={displayedPhotos} />
      )}

      {displayedPhotos.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleStartCleaning}
          activeOpacity={0.8}
        >
          <Text style={styles.fabText}>
            Начать разбор ({displayedPhotos.length})
          </Text>
        </TouchableOpacity>
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
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  headerTitle: { 
    ...TYPOGRAPHY.title, 
    color: COLORS.textMain 
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: 30,
    ...SHADOWS.medium, // Используем тень из темы
  },
  fabText: { 
    color: COLORS.white, 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
})