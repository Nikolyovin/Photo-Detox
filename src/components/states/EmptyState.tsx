import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme'

interface EmptyStateProps {
  message?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'Здесь пока пусто',
}) => {
  return (
    <View style={styles.center}>
      <Text style={styles.icon}>🕵️‍♂️</Text>
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
    padding: SPACING.lg,
  },
  icon: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.subtitle,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
})