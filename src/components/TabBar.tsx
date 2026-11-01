import React, { useCallback, useMemo } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FilterType } from '../types'
import { SPACING, SHADOWS, TYPOGRAPHY, ThemeColors } from '../theme'
import { useTheme } from '../theme/ThemeContext'

interface TabBarProps {
  activeTab: FilterType
  onTabChange: (tab: FilterType) => void
  allCount: number
  screenshotsCount: number
}

// Массив с конфигурацией вкладок
const TABS = [
  { key: 'all' as FilterType, label: 'Все' },
  { key: 'screenshots' as FilterType, label: 'Скриншоты' },
]

export const TabBar: React.FC<TabBarProps> = React.memo(({
  activeTab,
  onTabChange,
  allCount,
  screenshotsCount,
}) => {
  const { colors } = useTheme()
  // Генерируем стили на основе текущей темы
  const styles = useMemo(() => createStyles(colors), [colors])

  const handlePress = useCallback((tabKey: FilterType) => {
    onTabChange(tabKey)
  }, [onTabChange])

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key
          const count = tab.key === 'all' ? allCount : screenshotsCount
          const label = `${tab.label} (${count})`

          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => handlePress(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={isActive ? styles.activeTabText : styles.tabText}>
                {label}
              </Text>
            </TouchableOpacity>
          )
        })}
      </View>
    </View>
  )
})

// Фабрика стилей
const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.tabBackground, // Динамический цвет
    borderRadius: 24,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: colors.card, // В темной теме это будет темно-серый, а не белый
    ...SHADOWS.soft,
  },
  tabText: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    fontWeight: '500',
    color: colors.textSecondary, // Динамический цвет
  },
  activeTabText: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary, // Динамический цвет
  },
})