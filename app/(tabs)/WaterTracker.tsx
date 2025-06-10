import React, { useEffect } from 'react';
import { View, Text, Button, Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

// Configure foreground behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  

export default function App() {

  useEffect(() => {
    registerForPushNotificationsAsync();
    scheduleHydrationReminder(); // Auto-schedule on start
  }, []);

  // Register permission
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
        return;
      }
    } else {
      alert('Must use a physical device for Notifications');
    }
  }

  // Schedule notification every 2 hours
  async function scheduleHydrationReminder() {
    // Cancel previous to avoid duplication
    await Notifications.cancelAllScheduledNotificationsAsync();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💧 Time to Drink Water!",
        body: "Stay hydrated! Log your water now.",
        sound: true,
      },
      trigger: {
        seconds: 2 * 60 * 60, // Every 2 hours
        repeats: true,
      },
    });
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>🚰 Water Reminder App</Text>
      <Button title="Schedule Hydration Reminder" onPress={scheduleHydrationReminder} />
    </View>
  );
}
