import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { FilterType } from '../types'

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
    <View style={styles.tabBar}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'all' && styles.activeTab]}
        onPress={() => onTabChange('all')}
      >
        <Text
          style={activeTab === 'all' ? styles.activeTabText : styles.tabText}
        >
          Все фото ({allCount})
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'screenshots' && styles.activeTab]}
        onPress={() => onTabChange('screenshots')}
      >
        <Text
          style={
            activeTab === 'screenshots' ? styles.activeTabText : styles.tabText
          }
        >
          Скриншоты ({screenshotsCount})
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#333',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
})
