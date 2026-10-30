import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
} from 'react-native-reanimated'
import { Asset } from '../types'
import { COLORS, SHADOWS } from '../theme'

const { width, height } = Dimensions.get('window')
const SWIPE_THRESHOLD = width * 0.25

interface SwipeCardProps {
  photo: Asset
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  photo,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX
      translateY.value = event.translationY
    })
    .onEnd((event) => {
      if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(width * 1.5)
        runOnJS(onSwipeRight)()
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-width * 1.5)
        runOnJS(onSwipeLeft)()
      } else {
        translateX.value = withSpring(0)
        translateY.value = withSpring(0)
      }
    })

  // Стиль для самой карточки (поворот и сдвиг)
  const cardStyle = useAnimatedStyle(() => {
    const rotate = (translateX.value / width) * 15
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    }
  })

  // Стиль для плашки "УДАЛИТЬ" (появляется при свайпе влево)
  const leftBadgeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [-100, -20], [1, 0], 'clamp')
    const scale = interpolate(
      translateX.value,
      [-100, -20],
      [1.1, 0.8],
      'clamp',
    )
    return { opacity, transform: [{ scale }] }
  })

  // Стиль для плашки "ОСТАВИТЬ" (появляется при свайпе вправо)
  const rightBadgeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [20, 100], [0, 1], 'clamp')
    const scale = interpolate(translateX.value, [20, 100], [0.8, 1.1], 'clamp')
    return { opacity, transform: [{ scale }] }
  })

  return (
    <View style={styles.cardContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          {/* Картинка рендерится ПЕРВОЙ, чтобы быть на заднем плане */}
          <Image
            source={{ uri: (photo as any).uri }}
            style={styles.image}
            resizeMode='cover'
          />

          {/* Плашки рендерятся ПОВЕРХ картинки */}
          <Animated.View
            style={[styles.badge, styles.leftBadge, leftBadgeStyle]}
          >
            <Text style={[styles.badgeText, { color: COLORS.danger }]}>
              УДАЛИТЬ
            </Text>
          </Animated.View>

          <Animated.View
            style={[styles.badge, styles.rightBadge, rightBadgeStyle]}
          >
            <Text style={[styles.badgeText, { color: COLORS.accent }]}>
              ОСТАВИТЬ
            </Text>
          </Animated.View>

          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>← Удалить | Оставить →</Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    height: height * 0.7,
    overflow: 'hidden',
    backgroundColor: COLORS.card,
    borderRadius: 24,
    ...SHADOWS.medium,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Полупрозрачный белый фон для читаемости
  },
  leftBadge: {
    right: 20,
    borderColor: COLORS.danger,
    transform: [{ rotate: '15deg' }],
  },
  rightBadge: {
    left: 20,
    borderColor: COLORS.accent,
    transform: [{ rotate: '-15deg' }],
  },
  badgeText: {
    fontSize: 24,
    fontWeight: '900',
  },
  hintContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  hintText: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    fontWeight: 'bold',
  },
})
