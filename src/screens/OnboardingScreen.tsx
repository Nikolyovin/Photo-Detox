import React, { useState, useRef, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ListRenderItemInfo,
} from 'react-native'
import { COLORS, TYPOGRAPHY, SPACING } from '../theme'

const { width } = Dimensions.get('window')

const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }

const slides = [
  {
    id: '1',
    icon: '👆',
    title: 'Свайпай и очищай',
    description:
      'Влево — удалить, вправо — оставить. Быстро, удобно, как в Tinder, только для твоей галереи.',
  },
  {
    id: '2',
    icon: '🛡️',
    title: 'Безопасная корзина',
    description:
      'Удаленные фото не исчезают сразу. Они хранятся в корзине 7 дней, откуда их можно легко восстановить.',
  },
  {
    id: '3',
    icon: '✨',
    title: 'Без рекламы и мусора',
    description:
      'Мы не показываем рекламу, не просим подписку и не отправляем твои фото на сервер. Только чистота.',
  },
]

interface OnboardingScreenProps {
  onFinish: () => void
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onFinish,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  // 2. Используем наш CustomViewToken
  const onViewableItemsChanged = useCallback(
    (info: any) => {
      const { viewableItems } = info
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentIndex(viewableItems[0].index)
      }
    },
    []
  )

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
    []
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
            style={[
              styles.dot,
              index === currentIndex ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={scrollToNext}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? 'Начать пользоваться' : 'Далее'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: 50,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },
  icon: {
    fontSize: 100,
    marginBottom: SPACING.xl,
  },
  title: {
    ...TYPOGRAPHY.title,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: SPACING.xs,
  },
  activeDot: {
    backgroundColor: COLORS.primary,
  },
  inactiveDot: {
    backgroundColor: COLORS.inactiveDot,
  },
  button: {
    backgroundColor: COLORS.primary,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
})