// app/(tabs)/doctor/[id].jsx

import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DoctorAppointmentPage() {
  const { id } = useLocalSearchParams(); // Get the doctor ID from route
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Replace this with your actual backend endpoint
  const API_URL = `https://veersa-backend.onrender.com/api/doctors/${id}`;

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(API_URL);
        setDoctor(response.data);
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#06b6d4" />
        <Text className="text-gray-500 mt-2">Loading doctor details...</Text>
      </View>
    );
  }

  if (!doctor) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 font-bold">Doctor not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-xl font-bold text-center text-cyan-600 mb-4">
        Appointment
      </Text>

      {/* Doctor Info */}
      <View className="flex-row items-center mb-6 space-x-4">
        <Image
          source={ doctor.image}
          className="w-20 h-20 rounded-full"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold">{doctor.name}</Text>
          <Text className="text-gray-500">{doctor.specialization}</Text>
          <Text className="text-sm text-gray-500">{doctor.experience} years experience</Text>
          <Text className="text-green-600 font-bold mt-1">fees:{doctor.fees}</Text>
        </View>
      </View>

      <Text className="text-base font-semibold mb-2">Details</Text>
      <Text className="text-sm text-gray-600 mb-6">
        {doctor.description || "No description provided"}
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
