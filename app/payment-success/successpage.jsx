import React,{useEffect} from 'react';
import { View, Text, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';

export default function PaymentSuccessScreen() {
    const router = useRouter(); 
    useEffect(() => {
   
    const timer = setTimeout(() => {
      router.replace('/my-appointments'); 
    }, 2000); 
   
    return () => clearTimeout(timer);
  }, []);
  return (
    <View className="flex-1 bg-white justify-center items-center p-4">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View className="w-40 h-40 rounded-full bg-[#7BC1B7] justify-center items-center mb-8">
        <Ionicons name="checkmark" size={100} color="white" />
      </View>
      <Text className="text-3xl font-bold text-[#0B8FAC] mb-2">
        Congratulations
      </Text>
      <Text className="text-lg text-gray-700 text-center">
        Your Payment Is Successfully
      </Text>
    </View>
  );
}