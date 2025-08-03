import React from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export default function WaterBottle({ fillHeight }: { fillHeight: Animated.Value }) {
  return (
    <View style={styles.bottle}>
      <Animated.View style={[styles.fill, { height: fillHeight }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  bottle: {
    width: 100,
    height: 250,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#0077b6',
    marginBottom: 20,
  },
  fill: {
    backgroundColor: '#00b4d8',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});
