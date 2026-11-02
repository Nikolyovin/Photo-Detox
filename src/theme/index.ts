// src/theme/index.ts

// 1. Создаем две палитры
export const lightColors = {
  primary: '#6A5ACD',
  accent: '#2ECC71',
  danger: '#FF3B30',
  background: '#F8F9FA',
  backgroundSecondary: '#F5F5F5',
  card: '#FFFFFF',
  textMain: '#1C1C1E',
  textSecondary: '#8E8E93',
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',
  border: '#E2E8F0',
  tabBackground: '#EFEFF4', 
  buttonBackground: '#F0F0F0',
  snackbar: '#333333',
  inactiveDot: '#D1D1D6',
  
  overlayLight: 'rgba(255, 255, 255, 0.9)',
  overlayDark: 'rgba(0, 0, 0, 0.5)',
}

export const darkColors = {
  primary: '#8A7BFF', // Чуть светлее фиолетовый для темного фона
  accent: '#2ECC71',
  danger: '#FF453A', // Ярче красный для темной темы
  background: '#121212', // Глубокий черный
  backgroundSecondary: '#1E1E1E', // Темно-серый для карточек
  card: '#2C2C2E', // Цвет карточек
  textMain: '#FFFFFF', // Белый текст
  textSecondary: '#A1A1A6', // Светло-серый
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',
  border: '#333333',
  tabBackground: '#1E1E1E', 
  buttonBackground: '#2C2C2E',
  snackbar: '#2C2C2E', // Светлая плашка на темном фоне
  inactiveDot: '#48484A',
  
  overlayLight: 'rgba(44, 44, 46, 0.9)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
}

// Общий тип для цветов
export type ThemeColors = typeof lightColors

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 24,
  round: 999,
}

// Тут мы убрали color из TYPOGRAPHY, так как цвет теперь будет задаваться динамически
export const TYPOGRAPHY = {
  title: { fontSize: 28, fontWeight: '800' as const },
  subtitle: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  button: { fontSize: 16, fontWeight: '700' as const },
  caption: { fontSize: 14, fontWeight: '500' as const },
}

export const SHADOWS = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
}