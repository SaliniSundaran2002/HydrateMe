import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Alert,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  Platform,
  SafeAreaView,
} from 'react-native';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';

const GOAL_ML = 2000;
const CUP_ML = 250;

type WaterEntry = {
  date: string;
  time: string;
  amount: number;
};

export default function HomeScreen() {
  const [consumed, setConsumed] = useState(0);
  const fillHeight = useRef(new Animated.Value(0)).current;
  const [history, setHistory] = useState<WaterEntry[]>([]);
  const [goalMl, setGoalMl] = useState(GOAL_ML);
  const [showCalculator, setShowCalculator] = useState(true);
  const [inputGoal, setInputGoal] = useState(String(GOAL_ML));

  // Settings modal state
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [reminderTime, setReminderTime] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean | string>(false);
  const [selectedDate, setSelectedDate] = useState<string>(moment().format('YYYY-MM-DD'));

  const calculateGoal = () => {
    const parsedGoal = parseInt(inputGoal, 10);
    if (isNaN(parsedGoal) || parsedGoal <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid number for your water goal.");
      return;
    }
    setGoalMl(parsedGoal);
    setConsumed(0);
    setHistory([]);
    Animated.timing(fillHeight, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start();
    setShowCalculator(false);
  };

  if (showCalculator) {
    return (
      <SafeAreaView style={styles.calculatorContainer}>
        <Text style={styles.calculatorTitle}>Set Your Daily Water Goal</Text>
        <TextInput
          style={styles.calculatorInput}
          keyboardType="numeric"
          value={inputGoal}
          onChangeText={setInputGoal}
          placeholder="Enter goal in ml"
        />
        <TouchableOpacity style={styles.button} onPress={calculateGoal}>
          <Text style={styles.buttonText}>Set Goal</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const addWater = () => {
    if (consumed + CUP_ML > goalMl) return;

    const newConsumed = consumed + CUP_ML;
    setConsumed(newConsumed);

    const fillPercent = (newConsumed / goalMl) * 100;
    const today = moment().format('YYYY-MM-DD');
    const timestamp = new Date().toLocaleTimeString();
    setHistory(prev => [...prev, { date: today, time: timestamp, amount: CUP_ML }]);

    Animated.timing(fillHeight, {
      toValue: fillPercent,
      duration: 500,
      useNativeDriver: false,
    }).start();

    if (newConsumed === goalMl) {
      Alert.alert("🎉 Goal Reached", "You’ve successfully consumed your water goal for the day!");
    }
  };

  // Filter history by selected date
  const filteredHistory = history.filter(entry => entry.date === selectedDate);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e0f7fa' }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true}>
        {/* Settings Modal */}
        <Modal
          visible={settingsVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setSettingsVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'left' }}>Settings</Text>
              {/* Update Goal Section */}
              <View style={{ width: '100%', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>Update Daily Goal</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TextInput
                    style={[
                      styles.calculatorInput,
                      { width: 100, marginBottom: 0, marginRight: 8, fontSize: 16, padding: 8 },
                    ]}
                    keyboardType="numeric"
                    value={inputGoal}
                    onChangeText={setInputGoal}
                    placeholder="ml"
                  />
                  <TouchableOpacity
                    style={[styles.button, { paddingVertical: 8, paddingHorizontal: 16, marginTop: 0 }]}
                    onPress={calculateGoal}
                  >
                    <Text style={[styles.buttonText, { marginRight: 0 }]}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {/* Set Reminder Interval */}
              <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Set Reminder Interval</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                {[30, 60, 120].map((min) => (
                  <TouchableOpacity
                    key={min}
                    style={[
                      styles.button,
                      {
                        backgroundColor: reminderTime === min ? '#0077b6' : '#00b4d8',
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        marginHorizontal: 4,
                      },
                    ]}
                    onPress={() => setReminderTime(min)}
                  >
                    <Text style={styles.buttonText}>
                      {min === 30 ? '30 min' : `${min / 60} hour${min > 60 ? 's' : ''}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              {/* History by Date */}
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>View History by Date</Text>
                <TouchableOpacity
                  style={[styles.button, { paddingVertical: 8, marginTop: 0 }]}
                  onPress={() => setShowDatePicker('date')}
                >
                  <Text style={styles.buttonText}>
                    {moment(selectedDate).format('YYYY-MM-DD')}
                  </Text>
                </TouchableOpacity>
                {/* Date Picker for History */}
                {showDatePicker === 'date' && (
                  <DateTimePicker
                    value={moment(selectedDate).toDate()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={(_, selected) => {
                      setShowDatePicker(false);
                      if (selected) setSelectedDate(moment(selected).format('YYYY-MM-DD'));
                    }}
                  />
                )}
                <FlatList
                  data={filteredHistory}
                  keyExtractor={(item, idx) => `${item.date}-${item.time}-${item.amount}-${idx}`}
                  ListEmptyComponent={<Text style={{ color: '#888', marginTop: 10 }}>No entries</Text>}
                  renderItem={({ item }) => (
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
                      <Text>{item.time}</Text>
                      <Text>{item.amount}ml</Text>
                    </View>
                  )}
                  style={{ marginTop: 10, maxHeight: 120 }}
                />
              </View>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#888', marginTop: 20 }]}
                onPress={() => setSettingsVisible(false)}
              >
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View
  style={{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  }}
>
  <TouchableOpacity
    onPress={() => setSettingsVisible(true)}
    style={{
      backgroundColor: '#0077b6',
      borderRadius: 100,
      padding: 8,
      elevation: 2,
    }}
    accessibilityLabel="Settings"
  >
    <FontAwesome name="cog" size={24} color="#fff" />
  </TouchableOpacity>

  <Text style={[styles.title, { marginBottom: 0 }]}>
    Hydrate Me <FontAwesome6 name="bottle-water" size={28} color="#0000FF" />
  </Text>

  <View style={{ width: 40 }} />
</View>

<View style={{ marginBottom: 20, alignItems: 'center' }}>
  <Text style={{ color: '#0077b6', fontSize: 16 }}>
    {consumed < goalMl
      ? '💧 Don’t forget to drink water regularly!'
      : '🎉 You reached your goal! Stay hydrated!'}
  </Text>
</View>

        <Text style={styles.progressText}>
          {consumed}ml / {goalMl}ml
        </Text>

        <View style={styles.bottleSection}>
          <View style={styles.bottleWrapper}>
            <View style={styles.bottleCap} />
            <View style={styles.bottleNeck} />
            <View style={styles.bottleBody}>
              {Array.from({ length: Math.floor(goalMl / 250) + 1 }, (_, i) => {
                const ml = i * 250;
                const topPercent = 100 - (ml / goalMl) * 100;
                return (
                  <Text
                    key={i}
                    style={[
                      styles.measurementText,
                      {
                        top: `${topPercent}%`,
                        left: 5,
                        color: '#004e64',
                        fontSize: 12,
                        position: 'absolute',
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
          <Text style={styles.buttonText}>
            Add 250ml (1 <FontAwesome6 name="glass-water" size={15} color="white" />)
            <Entypo name="drop" size={24} color="white" />
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    minHeight: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0077b6',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#023e8a',
    marginBottom: 10,
    textAlign: 'center',
  },
  bottleSection: {
    alignItems: 'center',
    marginVertical: 24,
  },
  bottleWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bottleCap: {
    width: 40,
    height: 12,
    backgroundColor: '#0077b6',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    marginBottom: 2,
  },
  bottleNeck: {
    width: 24,
    height: 18,
    backgroundColor: '#90e0ef',
    borderRadius: 6,
    marginBottom: 2,
  },
  bottleBody: {
    width: 100,
    height: 280,
    backgroundColor: '#caf0f8',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#0077b6',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  waterFill: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: '#48cae4',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    zIndex: 1,
  },
  measurementText: {
    position: 'absolute',
    left: 5,
    color: '#004e64',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#00b4d8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 16,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 6,
  },
  calculatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0f7fa',
    padding: 24,
  },
  calculatorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0077b6',
    marginBottom: 20,
  },
  calculatorInput: {
    borderWidth: 1,
    borderColor: '#0077b6',
    borderRadius: 10,
    padding: 12,
    width: 200,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: '#fff',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: 320,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});
