import React, { useState } from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native'
import { TabBar } from '../components/TabBar'
import { PhotoGrid } from '../components/PhotoGrid'
import { FilterType, Asset } from '../types'
import { isScreenshot } from '../utils/mediaUtils'

interface HomeScreenProps {
  allPhotos: Asset[]
  isLoading: boolean
  hasPermission: boolean
  askPermission: () => void
  onStartCleaning: (photos: Asset[]) => void
  onOpenTrash: () => void // <-- Добавлен пропс
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  allPhotos,
  isLoading,
  hasPermission,
  askPermission,
  onStartCleaning,
  onOpenTrash, // <-- Добавлено сюда
}) => {
  const [activeTab, setActiveTab] = useState<FilterType>('all')

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size='large' color='#007AFF' />
        <Text style={{ marginTop: 10 }}>Загружаем галерею...</Text>
      </View>
    )
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Фото-Детокс</Text>
        <Text style={styles.subtitle}>
          Нужен доступ к галерее, чтобы найти скриншоты и дубликаты
        </Text>
        <Button title='Разрешить доступ' onPress={askPermission} />
      </View>
    )
  }

  const displayedPhotos =
    activeTab === 'all' ? allPhotos : allPhotos.filter(isScreenshot)

  const screenshotsCount = allPhotos.filter(isScreenshot).length

  return (
    <View style={styles.container}>
      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allCount={allPhotos.length}
        screenshotsCount={screenshotsCount}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Галерея</Text>
        <TouchableOpacity onPress={onOpenTrash}>
          <Text style={{ color: '#007AFF', fontSize: 16 }}>Корзина</Text>
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
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
