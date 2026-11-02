import React, { useMemo } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Switch, Linking, ScrollView } from 'react-native'
import { useTheme } from '../theme/ThemeContext'
import { useSettingsStore } from '../store/useSettingsStore'
import { SPACING, TYPOGRAPHY, ThemeColors } from '../theme'
import Constants from 'expo-constants'

interface SettingsScreenProps {
  onBack: () => void
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const { theme, toggleTheme, colors } = useTheme()
  const { trashRetentionDays, setTrashRetentionDays } = useSettingsStore()
  const styles = useMemo(() => createStyles(colors), [colors])

  const openLink = (url: string) => {
    Linking.openURL(url).catch((err) => console.error("Couldn't load page", err))
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Назад</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Настройки</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Внешний вид</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Темная тема</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: colors.primary }}
          />
        </View>

        <Text style={styles.sectionTitle}>Корзина</Text>
        <View style={styles.column}>
          <Text style={styles.rowLabel}>Срок хранения удаленных фото</Text>
          <View style={styles.pillsContainer}>
            {[3, 7, 14, 30].map((days) => (
              <TouchableOpacity
                key={days}
                style={[styles.pill, trashRetentionDays === days && styles.pillActive]}
                onPress={() => setTrashRetentionDays(days)}
              >
                <Text style={[styles.pillText, trashRetentionDays === days && styles.pillTextActive]}>
                  {days} дн.
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>О приложении</Text>
        <TouchableOpacity style={styles.linkRow} onPress={() => openLink('https://nikolyovin.github.io/photo-detox-privacy/')}>
          <Text style={styles.linkText}>Политика конфиденциальности</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkRow} onPress={() => openLink('https://github.com/Nikolyovin/Photo-Detox')}>
          <Text style={styles.linkText}>Исходный код (GitHub)</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>
          Версия {Constants.expoConfig?.version || '1.1.0'}
        </Text>
      </ScrollView>
    </View>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 50 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    height: 50,
  },
  backBtn: { width: 80 },
  backText: { fontSize: 18, color: colors.primary, fontWeight: '500' },
  headerTitle: { ...TYPOGRAPHY.title, color: colors.textMain, fontSize: 22 },
  placeholder: { width: 80 },
  content: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl },
  sectionTitle: {
    ...TYPOGRAPHY.subtitle,
    color: colors.textSecondary,
    fontSize: 14,
    textTransform: 'uppercase',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: SPACING.md,
    borderRadius: 16,
  },
  column: {
    backgroundColor: colors.card,
    padding: SPACING.md,
    borderRadius: 16,
  },
  rowLabel: { ...TYPOGRAPHY.body, color: colors.textMain, fontSize: 16 },
  pillsContainer: { flexDirection: 'row', marginTop: SPACING.md, gap: SPACING.sm, flexWrap: 'wrap' },
  pill: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { ...TYPOGRAPHY.body, color: colors.textMain },
  pillTextActive: { color: colors.white, fontWeight: 'bold' },
  linkRow: {
    backgroundColor: colors.card,
    padding: SPACING.md,
    borderRadius: 16,
    marginBottom: SPACING.sm,
  },
  linkText: { ...TYPOGRAPHY.body, color: colors.primary },
  versionText: { ...TYPOGRAPHY.caption, color: colors.textSecondary, textAlign: 'center', marginTop: SPACING.xl },
})