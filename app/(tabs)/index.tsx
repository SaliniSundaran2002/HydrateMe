import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from './HomeScreen'; 
import WaterTitleAnimation from './WaterTitleAnimation';
export default function Main() {
  const [showAnimation, setShowAnimation] = useState(true);

  useEffect(() => {
    // Hide animation after ~4 seconds (duration of your animation)
    const timer = setTimeout(() => setShowAnimation(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {showAnimation ? <WaterTitleAnimation /> : <HomeScreen />}
    </View>
  );
}
