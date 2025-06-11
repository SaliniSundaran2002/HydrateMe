import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal } from 'react-native';
import HomeScreen from './HomeScreen';
import WaterTitleAnimation from './WaterTitleAnimation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function Main() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [showUsageModal, setShowUsageModal] = useState(false);

  useEffect(() => {
    // Hide animation after ~4 seconds (duration of your animation)
    const timer = setTimeout(() => setShowAnimation(false), 4000);
    return () => clearTimeout(timer);
  }, []);
  const usageText = `
  Welcome to Hydrate Me!
  
  - Tap 'Add 250ml' button to add a glass of water to your daily goal.
  - Track your water intake with the water bottle graphic.
  - Check your daily history using the calendar and history toggle.
  - Stay hydrated and healthy!
  `;


  return (
    <View style={{ flex: 1 }}>
      {showAnimation ? <WaterTitleAnimation /> : <HomeScreen />}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showUsageModal}
        onRequestClose={() => setShowUsageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Use of App</Text>
            <Text style={styles.modalText}>{usageText}</Text>

            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowUsageModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <FontAwesome name="tint" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.footerText}>Stay Hydrated – Your body will thank you!</Text>
        </View>
        <TouchableOpacity onPress={() => setShowUsageModal(true)} style={{ marginTop: 20 }}>
          <Text style={styles.useLink}>📘 Use of App</Text>
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 12, marginTop: 10 }}>
          © 2025 Hydrate Me. All rights reserved.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#0077b6',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  useLink: {
    color: '#fff',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    maxHeight: '80%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#0077b6',
  },
  modalText: {
    fontSize: 16,
    color: '#023e8a',
  },
  modalCloseButton: {
    marginTop: 20,
    backgroundColor: '#00b4d8',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
