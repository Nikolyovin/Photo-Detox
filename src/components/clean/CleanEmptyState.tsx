import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS, SPACING } from '../../theme'

interface CleanEmptyStateProps {
  onFinish: () => void
}

export const CleanEmptyState: React.FC<CleanEmptyStateProps> = ({ onFinish }) => {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>🎉 Все разобрано!</Text>
      <TouchableOpacity style={styles.button} onPress={onFinish}>
        <Text style={styles.buttonText}>Вернуться на главную</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.md,
    color: COLORS.textMain,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    marginTop: SPACING.lg,
  },
  buttonText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
})