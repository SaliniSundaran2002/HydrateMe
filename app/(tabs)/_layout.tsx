import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, height: 60 },
        tabBarLabelStyle: { fontSize: 14, marginBottom: 8 },
      }}
    />
  );
}
