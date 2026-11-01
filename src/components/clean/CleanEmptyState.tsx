import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { SPACING, ThemeColors } from '../../theme'
import { useTheme } from '../../theme/ThemeContext'

interface CleanEmptyStateProps {
  onFinish: () => void
}

export const CleanEmptyState: React.FC<CleanEmptyStateProps> = ({ onFinish }) => {
  const { colors } = useTheme()
  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <View style={styles.center}>
      <Text style={styles.title}>🎉 Все разобрано!</Text>
      <TouchableOpacity style={styles.button} onPress={onFinish}>
        <Text style={styles.buttonText}>Вернуться на главную</Text>
      </TouchableOpacity>
    </View>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.md,
    color: colors.textMain,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    marginTop: SPACING.lg,
  },
  buttonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
})