import React, { createContext, useContext, useState, useEffect } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { lightColors, darkColors, ThemeColors } from './index'

type ThemeMode = 'light' | 'dark'

interface ThemeContextType {
  theme: ThemeMode
  colors: ThemeColors
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_KEY = '@photo_detox_theme'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme() // Определяем тему телефона
  const [theme, setTheme] = useState<ThemeMode>(systemScheme || 'light')
  const [isReady, setIsReady] = useState(false)

  // Загружаем сохраненную тему при старте
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY)
        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme)
        }
      } catch (e) {
        console.error('Ошибка загрузки темы', e)
      } finally {
        setIsReady(true)
      }
    }
    loadTheme()
  }, [])

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme)
    } catch (e) {
      console.error('Ошибка сохранения темы', e)
    }
  }

  const colors = theme === 'light' ? lightColors : darkColors

  if (!isReady) return null // Ждем загрузки, чтобы не было "мигания" темы

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// Удобный хук для использования в компонентах
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}