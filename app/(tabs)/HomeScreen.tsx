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
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import WaterTracker from './WaterTracker';

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
  const [goalMl, setGoalMl] = useState(GOAL_ML);
  const [showCalculator, setShowCalculator] = useState(true);
  const [inputGoal, setInputGoal] = useState(String(GOAL_ML));
  const [showReminder, setShowReminder] = useState(false);


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
      <View style={styles.calculatorContainer}>
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
      </View>
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

  const filteredHistory = history.filter(entry => entry.date === selectedDate);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={true}>
        <Text style={styles.title}>
          Hydrate Me <FontAwesome6 name="bottle-water" size={32} color="#0000FF" />
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: 10 }}>
        <TouchableOpacity
  onPress={() => setShowReminder(!showReminder)}
  style={{ flexDirection: 'row', alignItems: 'center' }}
>
  <FontAwesome name="clock-o" size={24} color="#0077b6" />
  <Text style={{ marginLeft: 5, color: '#0077b6', fontSize: 16 }}>Set Reminder</Text>
</TouchableOpacity>

        </View>

        {showReminder && <WaterTracker />}



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
  calculatorContainer: {
    flex: 1,
    backgroundColor: '#D6F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  calculatorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0077b6',
  },
  calculatorInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#0077b6',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    marginBottom: 20,
    backgroundColor: '#fff',
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

});
