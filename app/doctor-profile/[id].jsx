import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { addDays, format } from "date-fns";
import { useRouter } from 'expo-router';
import Image3 from '../../assets/images/Image1.png';

export default function DoctorAppointmentPage() {
   const router = useRouter();
  const { id } = useLocalSearchParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const getUpcomingDates = (availableDays) => {
    const dayMap = {
      Sun: 0, Mon: 1, Tue: 2, Wed: 3,
      Thu: 4, Fri: 5, Sat: 6
    };
    const today = new Date();
    const result = [];

    for (let i = 0; result.length < availableDays.length && i < 14; i++) {
      const nextDate = addDays(today, i);
      const dayIndex = nextDate.getDay(); // 0 (Sun) to 6 (Sat)

      availableDays.forEach((day) => {
        const shortDay = day.slice(0, 3);
        if (dayMap[shortDay] === dayIndex && !result.find(d => d.day === shortDay)) {
          result.push({
            day: shortDay,
            dateStr: format(nextDate, 'dd MMM'),
          });
        }
      });
    }

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
    <ScrollView className="flex-1 bg-white px-8 py-6">
      <Text className="text-xl font-bold text-center text-cyan-600 mb-4">
        Appointment
      </Text>

      {/* Doctor Info */}
      <View className="h-[250px] flex-row items-center mb-6 space-x-4 gap-4">
        <Image source={{uri:doctor.imageUrl}} className="w-[100px] h-[170px] rounded-xl" />
        <View className="flex-1 gap-2">
          <Text className="text-lg font-bold">{doctor.name}</Text>
          <Text className="text-gray-500">{doctor.specialization}</Text>
          <Text className="text-sm text-gray-500 font-bold">{doctor.experience} years experience</Text>
          <Text className="text-green-600 font-bold mt-1">
            <FontAwesome name="rupee" size={17} color="black" />{doctor.fees}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text className="text-base font-semibold mb-2">Details</Text>
      <Text className="text-sm text-gray-600 mb-6">
        {doctor.description || "No description provided"}
      </Text>

      {/* Time Slots */}
      <View className="h-[80px] flex-row justify-between items-center mb-2">
        <Text className="font-semibold">Working Hours</Text>
        <Text className="text-cyan-500">See All</Text>
      </View>

      <View className="flex-row flex-wrap gap-2 mb-6">
        {doctor.availableTimeSlots?.map((slot, i) => (
          <TouchableOpacity key={i} className="px-4 py-2 rounded-full bg-gray-100">
            <Text className="text-black font-medium">{slot}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dates */}
      <View className="flex-row justify-between items-center mb-2">
        <Text className="font-semibold">Date</Text>
        <Text className="text-cyan-500">See All</Text>
      </View>

      <View className="flex-row space-x-4 mb-10 gap-2">
        {upcomingDates.map((item, i) => (
          <TouchableOpacity key={i} className="px-4 py-2 rounded-full bg-cyan-500">
            <Text className="text-white font-medium">
              {item.day} {item.dateStr}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Book Button */}
      <TouchableOpacity className="bg-cyan-500 py-4 rounded-xl">
        <Text className="text-white text-center font-bold"
         onPress={() => router.push(`/book-appointment/bookAppointment?doctorId=${doctor._id}`)}>
          Book an Appointment
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}