import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'

export const LoadingState = () => {
  return (
    <View style={styles.center}>
      <ActivityIndicator size='large' color='#007AFF' />
      <Text style={styles.text}>Загружаем галерею...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: { marginTop: 10, fontSize: 16, color: '#666' },
})
