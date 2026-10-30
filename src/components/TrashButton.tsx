import React from 'react'
import { TouchableOpacity, Text, StyleSheet } from 'react-native'
import { COLORS } from '../theme'

interface TrashButtonProps {
  onPress: () => void
}

export const TrashButton: React.FC<TrashButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button} activeOpacity={0.7}>
      <Text style={styles.text}>🗑️ Корзина</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textMain,
  },
})