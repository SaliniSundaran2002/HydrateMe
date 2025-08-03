import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState<{ timestamp: string; amount: number }[]>([]);

  const loadEntries = async () => {
    const all = await AsyncStorage.getItem('hydrationLog');
    const parsed = all ? JSON.parse(all) : [];
    const filtered = parsed.filter((e: any) =>
      new Date(e.timestamp).toDateString() === selectedDate.toDateString()
    );
    setEntries(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Water Intake History</Text>
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="default"
        onChange={(_, d) => d && setSelectedDate(d)}
      />
      <Button title="Load Entries" onPress={loadEntries} />
      <FlatList
        data={entries}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>{new Date(item.timestamp).toLocaleTimeString()} - {item.amount}ml</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  item: { fontSize: 16, marginVertical: 4 },
});

