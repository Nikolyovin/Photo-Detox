import React from 'react'
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native' // <-- Добавили ViewStyle
import Animated, { AnimatedStyle } from 'react-native-reanimated'
import { COLORS, SHADOWS, SPACING } from '../../theme'

interface UndoSnackbarProps {
  // Указываем дженерик <ViewStyle>
  animatedStyle: AnimatedStyle<ViewStyle> 
  onUndo: () => void
}

export const UndoSnackbar: React.FC<UndoSnackbarProps> = ({ animatedStyle, onUndo }) => {
  return (
    <Animated.View style={[styles.undoSnackbar, animatedStyle]}>
      <Text style={styles.undoText}>Фото в корзине</Text>
      <TouchableOpacity onPress={onUndo} style={styles.undoButton}>
        <Text style={styles.undoButtonText}>Отменить</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  undoSnackbar: {
    position: 'absolute',
    bottom: 40,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: COLORS.snackbar,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  undoText: { color: COLORS.white, fontSize: 16, fontWeight: '500' },
  undoButton: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.sm },
  undoButtonText: { color: COLORS.accent, fontSize: 16, fontWeight: 'bold' },
})