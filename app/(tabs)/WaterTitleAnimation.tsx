import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function AnimatedSequence() {
  const drop = useRef(null);
  const fill = useRef(null);
  const drink = useRef(null);
  const zoom = useRef(null);

  useEffect(() => {
    drop.current?.play();
    drop.current?.addListener(({ isPlaying }) => {
      if (!isPlaying) fill.current?.play();
    });
    fill.current?.addListener(({ isPlaying }) => {
      if (!isPlaying) drink.current?.play();
    });
    drink.current?.addListener(({ isPlaying }) => {
      if (!isPlaying) zoom.current?.play();
    });
  }, []);

  return (
    <View style={styles.container}>
      <LottieView ref={drop} source={require('./assets/animations/waterDrops.json')} loop={false} style={styles.anim} />
      <LottieView ref={fill} source={require('./assets/animations/glassFill.json')} loop={false} style={styles.anim} />
      <LottieView ref={drink} source={require('./assets/animations/drinkWater.json')} loop={false} style={styles.anim} />
      <LottieView ref={zoom} source={require('./assets/animations/textZoom.json')} loop={false} style={styles.zoom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  anim: { width: 200, height: 200 },
  zoom: { width: 300, height: 100, marginTop: 20 },
});
