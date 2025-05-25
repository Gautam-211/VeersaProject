import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
export default function PaymentScreen() {
     const router = useRouter();
  return (
    <View className="flex-1 bg-[#00BCD4]"> 
      <StatusBar barStyle="light-content" backgroundColor="#00BCD4" /> 
      <View className="pt-14 pb-8 px-6 flex-row items-center justify-center relative">
        <TouchableOpacity className="absolute left-6 top-14 p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Payment</Text>
      </View>
      <View className="items-center mb-8">
        <Text className="text-white text-5xl font-bold">$ 120.00</Text>
      </View>
      <View className="flex-1 bg-gray-100 rounded-t-3xl p-6">
        <Text className="text-lg font-bold mb-4 text-gray-800">Doctor Chanaling Payment Method</Text>
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity className="flex-1 bg-[#00BCD4] py-3 rounded-lg mr-2 items-center justify-center">
            <Text className="text-white font-semibold text-base">Card Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-gray-200 py-3 rounded-lg ml-2 items-center justify-center">
            <Text className="text-gray-700 font-semibold text-base">Cash Payment</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-gray-700 text-sm font-semibold mb-2">Card Number</Text>
        <TextInput
          className="bg-white p-4 rounded-lg mb-4 text-base text-gray-800"
          placeholder="1234 8896 1145 0896"
          placeholderTextColor="#666"
          value="1234 8896 1145 0896"
          editable={false} 
        />
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Text className="text-gray-700 text-sm font-semibold mb-2">Expiry Date</Text>
            <TextInput
              className="bg-white p-4 rounded-lg text-base text-gray-800"
              placeholder="10/02/2022"
              placeholderTextColor="#666"
              value="10/02/2022" 
              editable={false}
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-gray-700 text-sm font-semibold mb-2">CVV</Text>
            <TextInput
              className="bg-white p-4 rounded-lg text-base text-gray-800"
              placeholder="204"
              placeholderTextColor="#666"
              value="204" 
              editable={false}
              keyboardType="numeric"
            />
          </View>
        </View>

        <Text className="text-gray-700 text-sm font-semibold mb-2">Name</Text>
        <TextInput
          className="bg-white p-4 rounded-lg mb-8 text-base text-gray-800"
          placeholder="Ravishka Sathsara"
          placeholderTextColor="#666"
          value="Ravishka Sathsara"  
          editable={false}
        />
        <TouchableOpacity className="bg-[#00BCD4] py-4 rounded-xl items-center justify-center" onPress={()=>router.push('/payment-success/successpage')}>
          <Text className="text-white text-lg font-bold">Pay Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}