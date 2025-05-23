import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
       options={{
    headerShown: false, 
    tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
  }}
      />
    </Tabs>
  );
}
