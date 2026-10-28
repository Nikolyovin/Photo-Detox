import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'
import { Asset } from '../types'

const { width, height } = Dimensions.get('window')
const SWIPE_THRESHOLD = width * 0.25 // Порог срабатывания свайпа (25% ширины экрана)

interface SwipeCardProps {
  photo: Asset
  onSwipeLeft: () => void // Удалить
  onSwipeRight: () => void // Оставить
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  photo,
  onSwipeLeft,
  onSwipeRight,
}) => {
  // Значения для анимации (сдвиг по X и Y)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX
      translateY.value = event.translationY
    })
    .onEnd((event) => {
        if (event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(width * 1.5);
        // Передаем пустой вызов, без photo!
        runOnJS(onSwipeRight)(); 
      } 
      else if (event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-width * 1.5);
        runOnJS(onSwipeLeft)();
      } 
      else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    })

  // Стили для анимации
  const animatedStyle = useAnimatedStyle(() => {
    // Поворот карточки в зависимости от сдвига (как в Tinder)
    const rotate = (translateX.value / width) * 15

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` },
      ],
    }
  })

  return (
    <View style={styles.cardContainer}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Image 
  source={{ uri: (photo as any).uri }} 
  style={styles.image} 
  resizeMode="cover" 
/>

          {/* Визуальная подсказка (можно стилизовать под "Оставить" / "Удалить") */}
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
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    overflow: 'hidden', // Чтобы картинка не вылезала за скругленные углы
  },
  image: {
    width: '100%',
    height: '100%',
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
