import React, { useMemo } from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { SPACING, TYPOGRAPHY, ThemeColors } from '../../theme'
import { useTheme } from '../../theme/ThemeContext'

export const LoadingState = () => {
  const { colors } = useTheme()
  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>Загружаем галерею...</Text>
    </View>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background, // Заменили white на background для темной темы
  },
  text: {
    ...TYPOGRAPHY.body,
    color: colors.textSecondary,
    marginTop: SPACING.md,
  },
})