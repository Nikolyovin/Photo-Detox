import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FilterType } from '../types'
import { COLORS, SPACING, SHADOWS } from '../theme'

interface TabBarProps {
  activeTab: FilterType
  onTabChange: (tab: FilterType) => void
  allCount: number
  screenshotsCount: number
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  allCount,
  screenshotsCount,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => onTabChange('all')}
        >
          <Text
            style={activeTab === 'all' ? styles.activeTabText : styles.tabText}
          >
            Все ({allCount})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'screenshots' && styles.activeTab]}
          onPress={() => onTabChange('screenshots')}
        >
          <Text
            style={
              activeTab === 'screenshots'
                ? styles.activeTabText
                : styles.tabText
            }
          >
            Скриншоты ({screenshotsCount})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#EFEFF4', // Светлый фон для подложки
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
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  activeTabText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary, // Фиолетовый цвет для активной
  },
})
