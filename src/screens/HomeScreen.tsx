import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { TabBar } from '../components/TabBar'
import { PhotoGrid } from '../components/PhotoGrid'
import { FilterType, Asset } from '../types'
import { isScreenshot } from '../utils/mediaUtils'
import { LoadingState } from '../components/states/LoadingState'
import { PermissionState } from '../components/states/PermissionState'
import { EmptyState } from '../components/states/EmptyState'

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

  // 1. Состояние загрузки
  if (isLoading) {
    return <LoadingState />
  }

  // 2. Состояние отсутствия разрешений
  if (!hasPermission) {
    return <PermissionState onAskPermission={askPermission} />
  }

  // Фильтрация
  const displayedPhotos =
    activeTab === 'all' ? allPhotos : allPhotos.filter(isScreenshot)
  const screenshotsCount = allPhotos.filter(isScreenshot).length

  // 3. Состояние пустой галереи
  if (displayedPhotos.length === 0) {
    return (
      <View style={styles.container}>
        <TabBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          allCount={allPhotos.length}
          screenshotsCount={screenshotsCount}
        />
        <EmptyState
          message={activeTab === 'all' ? 'Нет фотографий' : 'Нет скриншотов'}
        />
      </View>
    )
  }

  // 4. Основной экран
  return (
    <View style={styles.container}>
      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allCount={allPhotos.length}
        screenshotsCount={screenshotsCount}
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Галерея</Text>
        <TouchableOpacity onPress={onOpenTrash}>
          <Text style={styles.trashLink}>Корзина</Text>
        </TouchableOpacity>
      </View>

      <PhotoGrid photos={displayedPhotos} />

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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1C1C1E' },
  trashLink: { color: '#007AFF', fontSize: 16, fontWeight: '500' },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
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
