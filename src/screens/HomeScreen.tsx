import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { TabBar } from '../components/TabBar'
import { PhotoGrid } from '../components/PhotoGrid'
import { FilterType, Asset } from '../types'
import { isScreenshot } from '../utils/mediaUtils'
import { LoadingState } from '../components/states/LoadingState'
import { PermissionState } from '../components/states/PermissionState'
import { EmptyState } from '../components/states/EmptyState'
import { COLORS } from '../theme'
import { TrashButton } from '../components/TrashButton'
import { useTrash } from '../hooks/useTrash'

interface HomeScreenProps {
  allPhotos: Asset[]
  isLoading: boolean
  hasPermission: boolean
  askPermission: () => void
  onStartCleaning: (photos: Asset[]) => void
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

  // 1. Пока грузим галерею или корзину, показываем спиннер
  if (isLoading || isTrashLoading) return <LoadingState />
  
  if (!hasPermission) return <PermissionState onAskPermission={askPermission} />

  // 2. Собираем URI фото, которые лежат в корзине
  const trashUris = trash.map((t) => t.uri)

  // 3. Фильтруем общий список: убираем те, что в корзине
  const availablePhotos = allPhotos.filter(
    (photo) => !trashUris.includes((photo as any).uri)
  )

  // 4. Применяем фильтр вкладок уже к "чистому" списку
  const displayedPhotos =
    activeTab === 'all'
      ? availablePhotos
      : availablePhotos.filter(isScreenshot)

  // 5. Считаем количество для вкладок (тоже без учета корзины)
  const totalCount = availablePhotos.length
  const screenshotsCount = availablePhotos.filter(isScreenshot).length

  return (
    <View style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.headerTitle}>Галерея</Text>
        <TrashButton onPress={onOpenTrash} />
      </View>

      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allCount={totalCount}
        screenshotsCount={screenshotsCount}
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
          onPress={() => onStartCleaning(displayedPhotos)}
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
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.textMain },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  fabText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
})