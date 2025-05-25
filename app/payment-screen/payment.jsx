import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator } from 'react-native'; // Import ActivityIndicator
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGlobalContext } from "../../context/GlobalProvider";


export default function PaymentScreen() {
  const [loading, setLoading] = useState(false); // Renamed setLoding to setLoading for consistency
  const { user } = useGlobalContext();
  const router = useRouter();
  const params = useLocalSearchParams();
  const {
    appointmentId,
    doctorId,
    userId,
    date,
    timeSlot,
    reason,
    symptoms,
    notes,
    drivingLink,
    doctorName,
    doctorSpecialization,
    doctorExperience,
    doctorFees,
    doctorImageUrl,
  } = params;
  const staticCardNumber = "1234 8896 1145 0896";
  const staticExpiryDate = "10/02/2022";
  const staticCVV = "204";
  const staticName = user.name;
  const staticAmount = "$ 120.00";

  const handlePayNow = () => {
    setLoading(true);
    const fullAppointmentDetails = {
      appointmentId,
      doctorId,
      userId,
      date,
      timeSlot,
      reason,
      symptoms,
      notes,
      drivingLink,
      doctorName,
      doctorSpecialization,
      doctorExperience,
      doctorFees,
      doctorImageUrl,
    };

    // 2. Use setTimeout for the 2-second delay
    setTimeout(() => {
      router.replace({
        pathname: '/payment-success/successpage', // Ensure this path is correct
        params: fullAppointmentDetails,
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <View className="flex-1 bg-[#00BCD4]">
      <StatusBar barStyle="light-content" backgroundColor="#00BCD4" />

      {/* Top Section - Teal Background */}
      <View className="pt-14 pb-8 px-6 flex-row items-center justify-center relative">
        {/* Back Arrow */}
        <TouchableOpacity className="absolute left-6 top-14 p-2" onPress={() => router.back()} disabled={loading}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        {/* Payment Title */}
        <Text className="text-white text-xl font-bold">Payment</Text>
      </View>

      {/* Amount Display */}
      <View className="items-center mb-8">
        <Text className="text-white text-5xl font-bold">{staticAmount}</Text>
      </View>

      {/* Bottom Section - White/Light Gray Background */}
      <View className="flex-1 bg-gray-100 rounded-t-3xl p-6">
        <Text className="text-lg font-bold mb-4 text-gray-800">Doctor Chanaling Payment Method</Text>

        {/* Payment Method Buttons */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity className="flex-1 bg-[#00BCD4] py-3 rounded-lg mr-2 items-center justify-center" disabled={loading}>
            <Text className="text-white font-semibold text-base">Card Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-gray-200 py-3 rounded-lg ml-2 items-center justify-center" disabled={loading}>
            <Text className="text-gray-700 font-semibold text-base">Cash Payment</Text>
          </TouchableOpacity>
        </View>

        {/* Card Number Input */}
        <Text className="text-gray-700 text-sm font-semibold mb-2">Card Number</Text>
        <TextInput
          className="bg-white p-4 rounded-lg mb-4 text-base text-gray-800"
          placeholder="1234 8896 1145 0896"
          placeholderTextColor="#666"
          value={staticCardNumber}
          editable={false}
        />
        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Text className="text-gray-700 text-sm font-semibold mb-2">Expiry Date</Text>
            <TextInput
              className="bg-white p-4 rounded-lg text-base text-gray-800"
              placeholder="10/02/2022"
              placeholderTextColor="#666"
              value={staticExpiryDate}
              editable={false}
            />
          </View>
          <View className="flex-1 ml-2">
            <Text className="text-gray-700 text-sm font-semibold mb-2">CVV</Text>
            <TextInput
              className="bg-white p-4 rounded-lg text-base text-gray-800"
              placeholder="204"
              placeholderTextColor="#666"
              value={staticCVV}
              editable={false}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Name Input */}
        <Text className="text-gray-700 text-sm font-semibold mb-2">Name</Text>
        <TextInput
          className="bg-white p-4 rounded-lg mb-8 text-base text-gray-800"
          placeholder="Ravishka Sathsara"
          placeholderTextColor="#666"
          value={staticName}
          editable={false}
        />
        <TouchableOpacity
          onPress={handlePayNow}
          className="bg-[#00BCD4] py-4 rounded-xl items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="white" /> 
          ) : (
            <Text className="text-white text-lg font-bold">Pay Now</Text> 
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}