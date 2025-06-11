import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure foreground notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [reminderInterval, setReminderInterval] = useState<string>('2'); // Default interval in hours

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  // Request permission
  async function registerForPushNotificationsAsync() {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Permission required', 'Enable notifications to get hydration reminders!');
      }
    } else {
      Alert.alert('Device Required', 'Must use a physical device for Notifications');
    }
  }

  // Schedule hydration reminder
  async function scheduleHydrationReminder() {
    const intervalInHours = parseFloat(reminderInterval);

    if (isNaN(intervalInHours) || intervalInHours <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid number greater than 0.');
      return;
    }

    // Cancel all previous notifications
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💧 Time to Drink Water!",
        body: "Stay hydrated! Log your water now.",
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, // ✅ Proper enum
        seconds: intervalInHours * 3600,
        repeats: true,
      },
    });

    Alert.alert('✅ Reminder Scheduled', `You will be reminded every ${intervalInHours} hour(s).`);
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    

      <Text style={{ fontSize: 16, marginBottom: 10, color: "blue" }}>Select Reminder Interval:</Text>

      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
      <Button title="1 Hour" onPress={() => setReminderInterval('1')} />
      <View style={{ width: 10 }} />
      <Button title="2 Hours" onPress={() => setReminderInterval('2')} />
      <View style={{ width: 10 }} />
      <Button title="3 Hours" onPress={() => setReminderInterval('3')} />
      </View>

      <Text style={{ fontSize: 16, marginBottom: 10, color: "blue" }}>
      Selected Interval: {reminderInterval} hour(s)
      </Text>

      <Button title="Schedule Hydration Reminder" onPress={scheduleHydrationReminder} />
    </View>
  );
}
