import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useGoal } from './context/GoalContext';
import { useRouter } from 'expo-router';

export default function SetGoalScreen() {
  const { setGoalMl } = useGoal();
  const [input, setInput] = useState('');
  const router = useRouter();

  const handleSet = () => {
    const ml = parseInt(input);
    if (!isNaN(ml) && ml > 0) {
      setGoalMl(ml);
      router.replace('/(tabs)/HomeScreen');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Set Daily Water Intake Goal (ml)</Text>
      <TextInput
        keyboardType="numeric"
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="e.g. 2000"
      />
      <Button title="Save Goal" onPress={handleSet} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  label: { fontSize: 18, marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 20, padding: 10, borderRadius: 5 },
});