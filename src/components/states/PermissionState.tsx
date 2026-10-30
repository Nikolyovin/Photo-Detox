import React from 'react'
import { View, Text, Button, StyleSheet } from 'react-native'

interface PermissionStateProps {
  onAskPermission: () => void
}

export const PermissionState: React.FC<PermissionStateProps> = ({
  onAskPermission,
}) => {
  return (
    <View style={styles.center}>
      <Text style={{ fontSize: 60, marginBottom: 20 }}>🛡️</Text>
      <Text style={styles.title}>Добро пожаловать!</Text>
      <Text style={styles.subtitle}>
        Чтобы найти скриншоты и дубликаты, нам нужен доступ к вашей галерее. Мы
        не отправляем ваши фото в интернет.
      </Text>
      <Button title='Разрешить доступ' onPress={onAskPermission} />
    </View>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1C1C1E',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
})
