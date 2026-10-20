import React from 'react'
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  StyleSheet,
} from 'react-native'
import { Asset } from '../types'

const { width } = Dimensions.get('window')
const numColumns = 3
const imageSize = width / numColumns

interface PhotoGridProps {
  photos: Asset[]
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ photos }) => {
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
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item.uri }}
          style={{ width: imageSize, height: imageSize, margin: 1 }}
        />
      )}
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
    color: '#888',
    fontSize: 16,
  },
})
