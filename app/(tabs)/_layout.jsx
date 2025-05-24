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
          tabBarLabel: 'Home',
        }}
      />
      <Tabs.Screen
        name="my-appointments"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons size={28} name="calendar" color={color} />,
          tabBarLabel: 'Appointments',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />,
          tabBarLabel: 'Profile',
        }}
      />
    </Tabs>
  );
}
