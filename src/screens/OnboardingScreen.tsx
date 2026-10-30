import React, { useState, useRef } from 'react'
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

// Данные для наших слайдов
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

  // Обработка свайпа слайдов
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0)
    }
  }).current

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 })
    } else {
      onFinish() // Если это последний слайд, завершаем онбординг
    }
  }

  const renderItem = ({ item }: ListRenderItemInfo<(typeof slides)[0]>) => (
    <View style={styles.slide}>
      <Text style={styles.icon}>{item.icon}</Text>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  )

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      {/* Индикаторы (точки) */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentIndex ? COLORS.primary : '#D1D1D6',
              },
            ]}
          />
        ))}
      </View>

      {/* Кнопка действия */}
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
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    fontSize: 100,
    marginBottom: 40,
  },
  title: {
    ...TYPOGRAPHY.title,
    textAlign: 'center',
    marginBottom: 16,
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
    marginBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: COLORS.primary,
    marginHorizontal: 40,
    marginBottom: 50,
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
})
