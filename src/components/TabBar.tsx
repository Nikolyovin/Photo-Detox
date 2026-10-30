import React, { useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FilterType } from '../types'
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY } from '../theme'

interface TabBarProps {
  activeTab: FilterType
  onTabChange: (tab: FilterType) => void
  allCount: number
  screenshotsCount: number
}

// Массив с конфигурацией вкладок (убирает дублирование кода)
const TABS = [
  { key: 'all' as FilterType, label: 'Все' },
  { key: 'screenshots' as FilterType, label: 'Скриншоты' },
]

// Оборачиваем в React.memo, чтобы избежать лишних перерисовок
export const TabBar: React.FC<TabBarProps> = React.memo(({
  activeTab,
  onTabChange,
  allCount,
  screenshotsCount,
}) => {
  // Оптимизируем функцию нажатия
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.tabBackground, // Цвет из темы
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
    backgroundColor: COLORS.white,
    ...SHADOWS.soft,
  },
  tabText: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
  },
})