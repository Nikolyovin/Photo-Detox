import React, { useMemo } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SPACING, TYPOGRAPHY, ThemeColors } from '../../theme'
import { useTheme } from '../../theme/ThemeContext'

interface EmptyStateProps {
  message?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message = 'Здесь пока пусто',
}) => {
  const { colors } = useTheme()
  const styles = useMemo(() => createStyles(colors), [colors])

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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
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
    color: colors.textSecondary,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
})