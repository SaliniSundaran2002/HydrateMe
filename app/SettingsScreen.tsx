import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Button title="Update Goal" onPress={() => router.push('/SetGoalScreen')} />
      <Button title="View History" onPress={() => router.push('/SettingsScreen/HistoryScreen')} />
      <Button title="Reminder" onPress={() => router.push('/SettingsScreen/ReminderScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
});