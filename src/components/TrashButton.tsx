import React, { useMemo } from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { ThemeColors } from '../theme'
import { useTheme } from '../theme/ThemeContext'

interface TrashButtonProps {
  onPress: () => void
}

export const TrashButton: React.FC<TrashButtonProps> = React.memo(({ onPress }) => {
  const { colors } = useTheme()
  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={styles.button} 
      activeOpacity={0.7}
      accessibilityLabel="Корзина" // Для людей с ограниченными возможностями (Screen Readers)
    >
      <Text style={styles.icon}>🗑️</Text>
    </TouchableOpacity>
  )
})

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  button: {
    backgroundColor: colors.buttonBackground,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
})