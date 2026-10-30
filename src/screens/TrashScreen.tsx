import React from 'react'
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native'
import { useTrash } from '../hooks/useTrash'

const { width } = Dimensions.get('window')
const numColumns = 3
const imageSize = width / numColumns

interface TrashScreenProps {
  onBack: () => void
}

export const TrashScreen: React.FC<TrashScreenProps> = ({ onBack }) => {
  const { trash, removeFromTrash, emptyTrash } = useTrash()

  // Функция для показа окна подтверждения (используется только один раз)
  const handleClearTrash = () => {
    Alert.alert(
      'Очистить корзину?',
      'Эти фотографии будут удалены из галереи навсегда. Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Удалить', style: 'destructive', onPress: () => emptyTrash() },
      ],
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Корзина ({trash.length})</Text>

        {trash.length > 0 && (
          <TouchableOpacity onPress={handleClearTrash}>
            <Text style={styles.clearButton}>Очистить</Text>
          </TouchableOpacity>
        )}
      </View>

      {trash.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Корзина пуста</Text>
        </View>
      ) : (
        <FlatList
          data={trash}
          keyExtractor={(item, index) =>
            (item.photo as any).id || index.toString()
          }
          numColumns={numColumns}
          renderItem={({ item }) => (
            <View style={{ width: imageSize, height: imageSize, padding: 2 }}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.restoreButton}
                onPress={() => removeFromTrash(item.photo)}
              >
                <Text style={styles.restoreText}>↩</Text>
              </TouchableOpacity>
            </View>
          )}
        />
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
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: { fontSize: 18, color: '#007AFF', fontWeight: '500' },
  headerText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  clearButton: { fontSize: 16, color: '#FF3B30', fontWeight: '500' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#888' },
  image: { width: '100%', height: '100%', borderRadius: 8 },
  restoreButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderRadius: 15,
  },
  restoreText: { color: '#fff', fontSize: 14 },
})
