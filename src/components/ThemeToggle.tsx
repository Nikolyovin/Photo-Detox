import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { useTheme } from '../theme/ThemeContext'

export const ThemeToggle = () => {
  const { theme, toggleTheme, colors } = useTheme()

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.button, { backgroundColor: colors.buttonBackground }]}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>
        {theme === 'light' ? '🌙' : '☀️'}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 44,        // Фиксированная ширина
    height: 44,       // Фиксированная высота
    borderRadius: 22, // Делает форму идеального круга
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
})