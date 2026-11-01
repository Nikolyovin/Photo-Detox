import React, { useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { TrashButton } from '../TrashButton'
import { SPACING, ThemeColors } from '../../theme'
import { useTheme } from '../../theme/ThemeContext'

interface CleanHeaderProps {
  count: number
  onFinish: () => void
  onOpenTrash: () => void
}

export const CleanHeader: React.FC<CleanHeaderProps> = ({ count, onFinish, onOpenTrash }) => {
  const { colors } = useTheme()
  const styles = useMemo(() => createStyles(colors), [colors])

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onFinish}>
        <Text style={styles.backButton}>← Назад</Text>
      </TouchableOpacity>
      
      <Text style={styles.headerText}>Осталось: {count}</Text>
      
      <TrashButton onPress={onOpenTrash} />
    </View>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  backButton: { fontSize: 18, color: colors.primary, fontWeight: '500' },
  headerText: { fontSize: 18, fontWeight: 'bold', color: colors.textMain },
})