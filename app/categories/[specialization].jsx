import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAllDoctorsBySpecialization } from '../../lib/api1';

const DoctorsBySpecialization = () => {
  const { specialization } = useLocalSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctorsBySpecialization(specialization,50);
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialization]);

  const renderItem = ({ item }) => (
    <View className="flex-row mb-4 p-3 bg-[#E9FAFD] rounded-xl">
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/80' }}
        className="w-[80px] h-[80px] rounded-full"
      />
      <View className="flex-1 ml-3 justify-center">
        <Text className="text-base font-semibold">{item.name}</Text>
        <Text className="text-sm text-gray-600">Specialization: {item.specialization}</Text>
        <Text className="text-sm text-gray-600">Experience: {item.experience} years</Text>
        <Text className="text-sm text-gray-600">Fees: {item.fees}</Text>
        <Text className="text-sm text-gray-600">
          Time-slots: {Array.isArray(item.availableTimeSlots) ? item.availableTimeSlots.join(', ') : item.availableTimeSlots}
        </Text>
        <View className="flex-row justify-between mt-2">
          <TouchableOpacity
            onPress={() => router.push(`/doctor-profile/${item._id}`)}
            className="bg-[#00BCD4] px-4 py-1.5 rounded-full"
          >
            <Text className="text-white text-xs font-medium">View Detail</Text>
          </TouchableOpacity>
          <Text className="text-[#FF9800] text-sm font-medium">⭐ {item.rating}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#00BCD4" />
      </View>
    );
  }

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4 text-center mt-10">{specialization} Doctors</Text>
      <FlatList
        data={doctors}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default DoctorsBySpecialization;
