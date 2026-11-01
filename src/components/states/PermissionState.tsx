import React, { useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { SPACING, TYPOGRAPHY, ThemeColors } from '../../theme'
import { useTheme } from '../../theme/ThemeContext'

interface PermissionStateProps {
  onAskPermission: () => void
}

export const PermissionState: React.FC<PermissionStateProps> = ({
  onAskPermission,
}) => {
  const { colors } = useTheme()
  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <View style={styles.center}>
      <Text style={styles.icon}>🛡️</Text>
      
      <Text style={styles.title}>Добро пожаловать!</Text>
      
      <Text style={styles.subtitle}>
        Чтобы найти скриншоты и дубликаты, нам нужен доступ к вашей галерее. Мы
        не отправляем ваши фото в интернет.
      </Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={onAskPermission}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Разрешить доступ</Text>
      </TouchableOpacity>
    </View>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: colors.background, // Динамический фон
  },
  icon: {
    fontSize: 60,
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.title,
    color: colors.textMain, // Задали цвет явно
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    ...TYPOGRAPHY.button,
    color: colors.white, // Добавили белый цвет, так как убрали его из TYPOGRAPHY
  },
})