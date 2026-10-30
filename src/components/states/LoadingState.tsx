import React from 'react'
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme'

export const LoadingState = () => {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>Загружаем галерею...</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  text: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
})