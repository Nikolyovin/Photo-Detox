import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { COLORS, SPACING, TYPOGRAPHY } from '../theme'

interface TrashButtonProps {
  onPress: () => void
}

// Оборачиваем в React.memo, чтобы избежать лишних перерисовок
export const TrashButton: React.FC<TrashButtonProps> = React.memo(({ onPress }) => {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.button} 
      activeOpacity={0.7}
    >
      <Text style={styles.text}>🗑️ Корзина</Text>
    </TouchableOpacity>
  )
})

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.buttonBackground,
    paddingHorizontal: SPACING.md, // 16
    paddingVertical: SPACING.sm,   // 8
    borderRadius: 20,
  },
  text: {
    ...TYPOGRAPHY.body, // Базовый шрифт
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
  },
})