import React, { useState, useRef, useCallback, useMemo } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ListRenderItemInfo,
} from 'react-native'
import { TYPOGRAPHY, SPACING, ThemeColors } from '../theme'
import { useTheme } from '../theme/ThemeContext'

const { width } = Dimensions.get('window')

const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }

const slides = [
  {
    id: '1',
    icon: '👆',
    title: 'Свайпай и очищай',
    description: 'Влево — удалить, вправо — оставить. Быстро, удобно, как в Tinder, только для твоей галереи.',
  },
  {
    id: '2',
    icon: '🛡️',
    title: 'Безопасная корзина',
    description: 'Удаленные фото не исчезают сразу. Они хранятся в корзине 7 дней, откуда их можно легко восстановить.',
  },
  {
    id: '3',
    icon: '✨',
    title: 'Без рекламы и мусора',
    description: 'Мы не показываем рекламу, не просим подписку и не отправляем твои фото на сервер. Только чистота.',
  },
]

interface OnboardingScreenProps {
  onFinish: () => void
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
  const { colors } = useTheme()
  const styles = useMemo(() => createStyles(colors), [colors])

  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const onViewableItemsChanged = useCallback((info: any) => {
    const { viewableItems } = info
    if (viewableItems.length > 0 && viewableItems[0].index != null) {
      setCurrentIndex(viewableItems[0].index)
    }
  }, [])

  const scrollToNext = useCallback(() => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })
    } else {
      onFinish()
    }
  }, [currentIndex, onFinish])

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<(typeof slides)[0]>) => (
      <View style={styles.slide}>
        <Text style={styles.icon}>{item.icon}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    ),
    [styles] // <-- Важно: зависимость от styles
  )

  const keyExtractor = useCallback((item: (typeof slides)[0]) => item.id, [])

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index.toString()}
            style={[styles.dot, index === currentIndex ? styles.activeDot : styles.inactiveDot]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={scrollToNext} activeOpacity={0.8}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? 'Начать пользоваться' : 'Далее'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 50 },
  slide: { width: width, alignItems: 'center', justifyContent: 'center', paddingHorizontal: SPACING.xl },
  icon: { fontSize: 100, marginBottom: SPACING.xl },
  title: { ...TYPOGRAPHY.title, color: colors.textMain, textAlign: 'center', marginBottom: SPACING.md },
  description: { ...TYPOGRAPHY.body, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  pagination: { flexDirection: 'row', justifyContent: 'center', marginBottom: SPACING.xl },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: SPACING.xs },
  activeDot: { backgroundColor: colors.primary },
  inactiveDot: { backgroundColor: colors.inactiveDot },
  button: { backgroundColor: colors.primary, marginHorizontal: SPACING.xl, marginBottom: SPACING.xl, paddingVertical: SPACING.md, borderRadius: 30, alignItems: 'center' },
  buttonText: { color: colors.white, fontSize: 18, fontWeight: 'bold' },
})