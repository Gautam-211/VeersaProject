import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, SafeAreaView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons';
import { addDays, format } from "date-fns";
import { useRouter } from 'expo-router';
import { doctorProfile } from '../../lib/api1';

export default function DoctorAppointmentPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const data = await doctorProfile(id);
        setDoctor(data);
      } catch (err) {
        console.error("API error fetching doctor data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) { // Ensure id exists before fetching
      fetchDoctor();
    }
  }, [id]);

  const getUpcomingDates = (availableDays) => {
    const dayMap = {
      Sun: 0, Mon: 1, Tue: 2, Wed: 3,
      Thu: 4, Fri: 5, Sat: 6
    };
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to start of day

    const result = [];
    const maxDaysToCheck = 30; // Check up to 30 days to find all available days

    for (let i = 0; i < maxDaysToCheck && result.length < availableDays.length; i++) {
      const nextDate = addDays(today, i);
      const dayName = format(nextDate, "EEEE"); // Get full day name e.g., "Sunday"

      // Check if this day of the week is in the doctor's availableDays
      if (availableDays.some(d => d.toLowerCase() === dayName.toLowerCase())) {
        // Ensure we don't add duplicate days for the same day name
        // (e.g., if doctor is available on 'Monday', we only want the *next* Monday)
        const shortDay = dayName.slice(0, 3);
        if (!result.find(d => d.day === shortDay)) {
          result.push({
            day: shortDay,
            dateStr: format(nextDate, 'dd MMM'), // Format as "01 Jan"
            fullDate: nextDate // Store full date object for easier future use if needed
          });
        }
      }
    }
    // Sort results by full date to ensure chronological order
    result.sort((a, b) => a.fullDate.getTime() - b.fullDate.getTime());
    return result;
  };


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

  const upcomingDates = getUpcomingDates(doctor.availableDays || []);

  return (
    <SafeAreaView className="flex-1 bg-white">
    <ScrollView className="flex-1 bg-white px-8 py-6 ">
      <Text className="text-xl font-bold text-center text-cyan-600 mb-4">
        Appointment
      </Text>

      {/* Doctor Info */}
      <View className="h-[250px] flex-row items-center mb-6 p-4 bg-gray-50 rounded-2xl">
        <Image source={{ uri: doctor.imageUrl }} className="w-[120px] h-[200px] rounded-2xl" />
        <View className="flex-1 ml-4 gap-2">
          <View className="flex-row items-center">
            <Ionicons name="person" size={18} color="#06b6d4" />
            <Text className="text-lg font-bold ml-2">{doctor.name}</Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="medical" size={16} color="#8b5cf6" />
            <Text className="text-gray-500 ml-2">{doctor.specialization}</Text>
          </View>

          <View className="flex-row items-center">
            <Ionicons name="time" size={16} color="#f59e0b" />
            <Text className="text-sm text-gray-500 font-bold ml-2">{doctor.experience} years experience</Text>
          </View>

          <View className="flex-row items-center mt-1">
            <FontAwesome name="rupee" size={15} color="#10b981" />
            <Text className="text-green-600 font-bold ml-1">{doctor.fees}</Text>
          </View>
        </View>
      </View>

      {/* Contact Information */}
      <View className="mb-6 bg-gray-50 p-4 rounded-2xl">
        {/* Address */}
        <View className="flex-row items-center mb-3">
          <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center">
            <Ionicons name="location" size={18} color="#ef4444" />
          </View>
          <Text className="text-sm text-gray-600 ml-3 flex-1">
            {doctor.address || "Address not provided"}
          </Text>
        </View>

        {/* Email */}
        <View className="flex-row items-center mb-3">
          <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
            <Ionicons name="mail" size={18} color="#3b82f6" />
          </View>
          <Text className="text-sm text-gray-600 ml-3 flex-1">
            {doctor.email || "Email not provided"}
          </Text>
        </View>

        {/* Phone */}
        <View className="flex-row items-center">
          <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center">
            <Ionicons name="call" size={18} color="#10b981" />
          </View>
          <Text className="text-sm text-gray-600 ml-3 flex-1">
            {doctor.phone || "Phone not provided"}
          </Text>
        </View>
      </View>

      {/* Time Slots */}
      <View className="mb-6">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={20} color="#06b6d4" />
            <Text className="font-semibold ml-2">Working Hours</Text>
          </View>
          <TouchableOpacity>
            <Text className="text-cyan-500 font-medium">See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            {doctor.availableTimeSlots?.map((slot, i) => (
              <TouchableOpacity key={i} className="px-6 py-3 rounded-2xl bg-cyan-50 border border-cyan-200">
                <Text className="text-cyan-700 font-medium">{slot}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Dates */}
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={20} color="#06b6d4" />
            <Text className="font-semibold ml-2">Available Dates</Text>
          </View>
          <TouchableOpacity>
            <Text className="text-cyan-500 font-medium">See All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-3">
            {upcomingDates.map((item, i) => (
              <TouchableOpacity key={i} className="px-6 py-4 rounded-2xl bg-cyan-500 shadow-sm">
                <Text className="text-white font-semibold text-center">
                  {item.day}
                </Text>
                <Text className="text-white text-sm text-center mt-1">
                  {item.dateStr}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Book Button */}
      <TouchableOpacity className="bg-cyan-500 py-4 rounded-2xl shadow-lg">
        <Text className="text-white text-center font-bold text-lg"
          onPress={() => router.push(`/book-appointment/bookAppointment?doctorId=${doctor._id}`)}>
          Book an Appointment
        </Text>
      </TouchableOpacity>
    </ScrollView>
    </SafeAreaView>
  );
}
