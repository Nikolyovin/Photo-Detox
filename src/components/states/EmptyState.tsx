import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

interface EmptyStateProps {
  message?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'Здесь пока пусто',
}) => {
  return (
    <View style={styles.center}>
      <Text style={{ fontSize: 48, marginBottom: 10 }}>🕵️‍♂️</Text>
      <Text style={styles.title}>{message}</Text>
      <Text style={styles.subtitle}>
        Попробуйте другую вкладку или добавьте фото
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: { fontSize: 18, color: '#888', fontWeight: 'bold' },
  subtitle: { color: '#888', marginTop: 5, textAlign: 'center' },
})
