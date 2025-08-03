import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function WaterButtons({
  consumed,
  goal,
  onAdd,
}: {
  consumed: number;
  goal: number;
  onAdd: (amount: number) => void;
}) {
  const options = [50, 100, 200, 300, 500];
  const remaining = goal - consumed;

  return (
    <View style={styles.container}>
      {options.map((amount) => (
        amount <= remaining && (
          <TouchableOpacity key={amount} style={styles.button} onPress={() => onAdd(amount)}>
            <Text style={styles.text}>+{amount}ml</Text>
          </TouchableOpacity>
        )
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginVertical: 10 },
  button: { backgroundColor: '#0077b6', padding: 10, margin: 5, borderRadius: 10 },
  text: { color: '#fff', fontSize: 16 },
});
