import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme'

interface PermissionStateProps {
  onAskPermission: () => void
}

export const PermissionState: React.FC<PermissionStateProps> = ({
  onAskPermission,
}) => {
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

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.white,
  },
  icon: {
    fontSize: 60,
    marginBottom: SPACING.lg,
  },
  title: {
    ...TYPOGRAPHY.title, // Используем заголовок из темы
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  subtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22, // Добавил межстрочный интервал для читаемости
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%', // Кнопка на всю ширину (с учетом отступов)
    alignItems: 'center',
  },
  buttonText: {
    ...TYPOGRAPHY.button, // Используем стиль для текста кнопок
  },
})