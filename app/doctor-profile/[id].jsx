// app/(tabs)/doctor/[id].jsx

import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function DoctorAppointmentPage() {
  const { id } = useLocalSearchParams(); // get doctor ID from URL

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      {/* Header */}
      <Text className="text-xl font-bold text-center text-cyan-600 mb-4">
        Appointment
      </Text>

      {/* Doctor Card */}
      <View className="flex-row items-center mb-6 space-x-4">
        <Image
          source={{ uri: "https://via.placeholder.com/100" }}
          className="w-20 h-20 rounded-full"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold">{id}</Text>
          <Text className="text-gray-500">Denteeth</Text>
          <Text className="text-green-600 font-bold mt-1">$120.00</Text>
        </View>
      </View>

      {/* Details */}
      <Text className="text-base font-semibold mb-2">Details</Text>
      <Text className="text-sm text-gray-600 mb-6">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
        tempus urna at turpis condimentum.
      </Text>

      {/* Working Hours */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-semibold">Working Hours</Text>
        <Text className="text-cyan-500">See All</Text>
      </View>
      <View className="flex-row space-x-4 mb-6">
        {["10.00 AM", "11.00 AM", "12.00 PM"].map((time, i) => (
          <TouchableOpacity
            key={i}
            className={`px-4 py-2 rounded-full ${
              i === 1 ? "bg-cyan-500 text-white" : "bg-gray-100"
            }`}
          >
            <Text
              className={`${
                i === 1 ? "text-white" : "text-black"
              } font-medium`}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dates */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-semibold">Date</Text>
        <Text className="text-cyan-500">See All</Text>
      </View>
      <View className="flex-row space-x-4 mb-10">
        {["Sun 4", "Mon 5", "Tue 6"].map((day, i) => (
          <TouchableOpacity
            key={i}
            className={`px-4 py-2 rounded-full ${
              i === 0 ? "bg-cyan-500" : "bg-gray-100"
            }`}
          >
            <Text
              className={`${
                i === 0 ? "text-white" : "text-black"
              } font-medium`}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Book Button */}
      <TouchableOpacity className="bg-cyan-500 py-4 rounded-xl">
        <Text className="text-white text-center font-bold">
          Book an Appointment
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
