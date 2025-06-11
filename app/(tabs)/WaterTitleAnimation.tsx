import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text,
} from 'react-native';
import { Audio } from 'expo-av';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

export default function WaterTitleAnimation() {
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate water fill (used for both background and text)
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    // Play water drop sound
    async function playSound() {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/drop.mp3')
      );
      sound.setPositionAsync(0);
      await sound.playAsync();
    }

    playSound();
  }, []);

  // Interpolate water fill for background
  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Interpolate translateY of gradient to simulate "water rising" inside the text
  const gradientTranslateY = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0], // moves gradient up
  });

  return (
    <View style={styles.container}>
      {/* Background Water Fill */}
      <Animated.View style={[styles.fill, { height: fillHeight }]} />

      {/* Title with Gradient Fill Animation */}
      <View style={styles.titleContainer}>
        <MaskedView
          maskElement={<Text style={styles.title}>Hydrate Me</Text>}
        >
          <Animated.View
            style={{
              height: 50,
              width: 300,
              transform: [{ translateY: gradientTranslateY }],
            }}
          >
            <LinearGradient
              colors={['#00c6ff', '#ffffff']}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </MaskedView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#00c6ff',
  },
  titleContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'black',
    backgroundColor: 'transparent',
  },
});
