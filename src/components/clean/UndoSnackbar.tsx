import React, { useMemo } from 'react'
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import Animated, { AnimatedStyle } from 'react-native-reanimated'
import { SHADOWS, SPACING, ThemeColors } from '../../theme'
import { useTheme } from '../../theme/ThemeContext'

interface UndoSnackbarProps {
  animatedStyle: AnimatedStyle<ViewStyle> 
  onUndo: () => void
}

export const UndoSnackbar: React.FC<UndoSnackbarProps> = ({ animatedStyle, onUndo }) => {
  const { colors } = useTheme()
  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <Animated.View style={[styles.undoSnackbar, animatedStyle]}>
      <Text style={styles.undoText}>Фото в корзине</Text>
      <TouchableOpacity onPress={onUndo} style={styles.undoButton}>
        <Text style={styles.undoButtonText}>Отменить</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  undoSnackbar: {
    position: 'absolute',
    bottom: 40,
    left: SPACING.lg,
    right: SPACING.lg,
    backgroundColor: colors.snackbar,
    borderRadius: 12,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  undoText: { color: colors.white, fontSize: 16, fontWeight: '500' },
  undoButton: { paddingVertical: SPACING.xs, paddingHorizontal: SPACING.sm },
  undoButtonText: { color: colors.accent, fontSize: 16, fontWeight: 'bold' },
})