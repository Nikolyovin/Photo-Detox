export const COLORS = {
  primary: '#6A5ACD', // Фиолетово-синий (основной)
  accent: '#2ECC71', // Зеленый (Оставить)
  danger: '#FF3B30', // Красный (Удалить)
  background: '#F8F9FA', // Основной фон
  backgroundSecondary: '#F5F5F5', // Фон для экрана разбора
  card: '#FFFFFF', // Белый (карточки)
  textMain: '#1C1C1E', // Почти черный
  textSecondary: '#8E8E93', // Серый
  white: '#FFFFFF',
  black: '#000000',
  shadow: '#000000',
  
  // Элементы интерфейса
  tabBackground: '#EFEFF4', 
  buttonBackground: '#F0F0F0',
  snackbar: '#333333',
  inactiveDot: '#D1D1D6',
  
  // Прозрачные оверлеи
  overlayLight: 'rgba(255, 255, 255, 0.9)',
  overlayDark: 'rgba(0, 0, 0, 0.5)',
}

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
}

// ДОБАВИЛИ РАДИУСЫ
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 24,
  round: 999, // Для кнопок-таблеток
}

export const TYPOGRAPHY = {
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: COLORS.textMain,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: COLORS.textSecondary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: COLORS.textMain,
  },
  button: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: COLORS.white,
  },
}

export const SHADOWS = {
  soft: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  medium: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
}