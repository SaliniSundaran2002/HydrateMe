import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text,
} from 'react-native';
import { Audio } from 'expo-av';

export default function WaterWithWaveAndSound() {
  const fillAnim = useRef(new Animated.Value(0)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start water fill animation
    Animated.timing(fillAnim, {
      toValue: 1,
      duration: 3000,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      // Start wave animation loop once filled
      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    });

    async function playSound() {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/drop.mp3') // add this to your assets
      );
      sound.setPositionAsync(0);
      await sound.playAsync();
    }

    playSound();

    return () => {};
  }, []);

  // Interpolates fill with glass height
  const fillHeight = fillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Wave translation
  const translateX = waveAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hydrate Me</Text>
      <View style={styles.glass}>
        <Animated.View
          style={[
            styles.water,
            { height: fillHeight }
          ]}
        >
          <Animated.View
            style={[
              styles.wave,
              { transform: [{ translateX }] }
            ]}
          />
        </Animated.View>
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
  },
  title: {
    marginBottom: 20,
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0072ff',
  },
  glass: {
    width: 120,
    height: 240,
    borderColor: '#0072ff',
    borderWidth: 4,
    borderRadius: 10,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  water: {
    width: '100%',
    backgroundColor: '#00c6ff',
    position: 'absolute',
    bottom: 0,
  },
  wave: {
    width: '200%',
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10,
  },
});
