import React, { useMemo } from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import { GalleryAsset } from '../types' // Используем наш новый тип
import { COLORS, SHADOWS } from '../theme'

const { width, height } = Dimensions.get('window')

// Константы (убираем магические числа)
const CARD_WIDTH = width * 0.9
const CARD_HEIGHT = height * 0.7
const SWIPE_THRESHOLD = width * 0.25
const MAX_ROTATION = 15
const BADGE_THRESHOLD = 20
const BADGE_MAX_OPACITY = 100

interface SwipeCardProps {
  photo: GalleryAsset // Используем GalleryAsset
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

  // Оптимизация: Gesture.Pan создается только один раз
  const panGesture = useMemo(
    () =>
      Gesture.Pan()
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
        }),
    [onSwipeLeft, onSwipeRight, translateX, translateY]
  )

  const cardStyle = useAnimatedStyle(() => {
    const rotate = (translateX.value / width) * MAX_ROTATION
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    }
  })

  const leftBadgeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-BADGE_MAX_OPACITY, -BADGE_THRESHOLD],
      [1, 0],
      Extrapolation.CLAMP
    )
    const scale = interpolate(
      translateX.value,
      [-BADGE_MAX_OPACITY, -BADGE_THRESHOLD],
      [1.1, 0.8],
      Extrapolation.CLAMP
    )
    return { opacity, transform: [{ scale }] }
  })

  const rightBadgeStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [BADGE_THRESHOLD, BADGE_MAX_OPACITY],
      [0, 1],
      Extrapolation.CLAMP
    )
    const scale = interpolate(
      translateX.value,
      [BADGE_THRESHOLD, BADGE_MAX_OPACITY],
      [0.8, 1.1],
      Extrapolation.CLAMP
    )
    return { opacity, transform: [{ scale }] }
  })

  return (
    <View style={styles.cardContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, cardStyle]}>
          {/* Теперь обращаемся к photo.uri напрямую, без as any! */}
          <Image source={{ uri: photo.uri }} style={styles.image} resizeMode="cover" />

          <Animated.View style={[styles.badge, styles.leftBadge, leftBadgeStyle]}>
            <Text style={[styles.badgeText, { color: COLORS.danger }]}>УДАЛИТЬ</Text>
          </Animated.View>

          <Animated.View style={[styles.badge, styles.rightBadge, rightBadgeStyle]}>
            <Text style={[styles.badgeText, { color: COLORS.accent }]}>ОСТАВИТЬ</Text>
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
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
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
    backgroundColor: COLORS.overlayLight, // Используем цвет из темы
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
    backgroundColor: COLORS.overlayDark, // Используем цвет из темы
    color: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    fontWeight: 'bold',
  },
})