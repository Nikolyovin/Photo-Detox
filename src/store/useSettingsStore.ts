import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface SettingsState {
  trashRetentionDays: number
  setTrashRetentionDays: (days: number) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      trashRetentionDays: 7, // По умолчанию 7 дней
      setTrashRetentionDays: (days) => set({ trashRetentionDays: days }),
    }),
    {
      name: 'photo-detox-settings',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
