import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
  Modal,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';

type WaterEntry = {
  date: string;
  time: string;
  amount: number;
};

const GOAL_ML = 2000;
const CUP_ML = 250;

export default function HomeScreen() {
  const [consumed, setConsumed] = useState(0);
  const fillHeight = useRef(new Animated.Value(0)).current;
  const [history, setHistory] = useState<WaterEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [showUsageModal, setShowUsageModal] = useState(false);

  const usageText = `
  Welcome to Hydrate Me!
  
  - Tap 'Add 250ml' button to add a glass of water to your daily goal.
  - Track your water intake with the water bottle graphic.
  - Check your daily history using the calendar and history toggle.
  - Stay hydrated and healthy!
  `;

  const addWater = () => {
    if (consumed + CUP_ML > GOAL_ML) return;

    const newConsumed = consumed + CUP_ML;
    setConsumed(newConsumed);

    const fillPercent = (newConsumed / GOAL_ML) * 100;
    const today = moment().format('YYYY-MM-DD');
    const timestamp = new Date().toLocaleTimeString();
    setHistory(prev => [...prev, { date: today, time: timestamp, amount: CUP_ML }]);

    Animated.timing(fillHeight, {
      toValue: fillPercent,
      duration: 500,
      useNativeDriver: false,
    }).start();

    if (newConsumed === GOAL_ML) {
      Alert.alert("🎉 Goal Reached", "You’ve successfully consumed your water goal for the day!");
    }
  };

  const filteredHistory = history.filter(entry => entry.date === selectedDate);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true}>
        <Text style={styles.title}>Hydrate Me <FontAwesome6 name="bottle-water" size={32} color="##0000FF" /></Text>

        <Text style={styles.progressText}>
          {consumed}ml / {GOAL_ML}ml
        </Text>

        <View style={styles.bottleSection}>
          <View style={styles.bottleWrapper}>
            <View style={styles.bottleCap} />
            <View style={styles.bottleNeck} />
            <View style={styles.bottleBody}>
              {Array.from({ length: 5 }, (_, i) => {
                const ml = i * 500;
                const topPercent = 100 - (ml / GOAL_ML) * 100;
                return (
                  <Text
                    key={ml}
                    style={[
                      styles.measurementText,
                      {
                        top: `${topPercent}%`,
                        left: 5,
                        color: '#004e64',
                        fontSize: 12,
                      },
                    ]}
                  >
                    {ml}ml
                  </Text>
                );
              })}

              <Animated.View
                style={[
                  styles.waterFill,
                  {
                    height: fillHeight.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                  },
                ]}
              />
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={addWater}>
          <Text style={styles.buttonText}>Add 250ml (1 <FontAwesome6 name="glass-water" size={15} color="white" />)<Entypo name="drop" size={24} color="white" /> </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#90e0ef' }]}
          onPress={() => setShowHistory(!showHistory)}
        >
          <Text style={styles.buttonText}>
            {showHistory ? 'Hide History 📉' : 'Show History 📈'}
          </Text>
        </TouchableOpacity>

        {showHistory && (
          <>
            <Calendar
              onDayPress={day => setSelectedDate(day.dateString)}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#00b4d8' },
              }}
              style={{ marginTop: 20, width: '100%' }}
            />

            <View style={{ maxHeight: 200, marginTop: 10, width: '100%' }}>
              <Text style={[styles.historyTitle, { marginBottom: 5 }]}>
                Water Intake on {selectedDate}
              </Text>

              {filteredHistory.length === 0 ? (
                <Text style={styles.historyText}>No water consumed on this day.</Text>
              ) : (
                filteredHistory.map((entry, idx) => (
                  <Text key={idx} style={styles.historyText}>
                    {idx + 1}. {entry.time} - Drank {entry.amount}ml
                  </Text>
                ))
              )}
            </View>
          </>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showUsageModal}
        onRequestClose={() => setShowUsageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Use of App</Text>
              <Text style={styles.modalText}>{usageText}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowUsageModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <FontAwesome name="tint" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.footerText}>Stay Hydrated – Your body will thank you!</Text>
        </View>
        <TouchableOpacity
          onPress={() => setShowUsageModal(true)}
          style={{ marginTop: 20 }}
        >
          <Text style={styles.useLink}>📘 Use of App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#D6F6FF',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 30,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0077b6',
    marginRight: 8,
    marginTop: 10
  },
  progressText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#0077b6',
  },
  bottleSection: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  measurementLabels: {
    justifyContent: 'space-between',
    height: 260,
    paddingRight: 15,
  },
  measurementText: {
    position: 'absolute',
    left: -45,
    fontSize: 12,
    color: '#0077b6',
  },
  bottleWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  bottleCap: {
    width: 40,
    height: 20,
    backgroundColor: '#0077b6',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  bottleNeck: {
    width: 60,
    height: 30,
    backgroundColor: '#00b4d8',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: -1,
  },
  bottleBody: {
    width: 120,
    height: 400,
    backgroundColor: '#e0f7fa',
    borderColor: '#0077b6',
    borderWidth: 4,
    borderRadius: 60,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  waterFill: {
    backgroundColor: '#00b4d8',
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#00b4d8',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  historyContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    width: '80%',
    maxHeight: 200,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0077b6',
  },
  historyText: {
    fontSize: 14,
    color: '#023e8a',
    marginBottom: 5,
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
});
