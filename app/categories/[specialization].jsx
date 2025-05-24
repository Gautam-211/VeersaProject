import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAllDoctorsBySpecialization } from '../../lib/api1';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalContext } from '../../context/GlobalProvider'; // Import useGlobalContext

// Utility function to convert degrees to radians
const toRadians = (deg) => deg * (Math.PI / 180);

// Haversine formula to calculate distance between two lat/lon points in kilometers
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in kilometers
};

const DoctorsBySpecialization = () => {
  const { specialization } = useLocalSearchParams();
  const { user } = useGlobalContext(); // Get user from global context
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to sort doctors by distance from the user
  const sortDoctorsByDistance = (doctorsArray) => {
    // Check if user location is available
    if (!user || typeof user.latitude !== 'number' || typeof user.longitude !== 'number') {
      console.warn("User location not available for sorting doctors by distance.");
      return doctorsArray; // Return unsorted if user location is missing
    }

    const userLat = user.latitude;
    const userLon = user.longitude;

    // Sort a copy of the array to avoid direct state mutation issues
    const sorted = [...doctorsArray].sort((a, b) => {
      // Ensure doctor location is available
      if (typeof a.latitude !== 'number' || typeof a.longitude !== 'number') return 1; // Push missing location to end
      if (typeof b.latitude !== 'number' || typeof b.longitude !== 'number') return -1; // Push missing location to end

      const distA = haversineDistance(userLat, userLon, a.latitude, a.longitude);
      const distB = haversineDistance(userLat, userLon, b.latitude, b.longitude);

      return distA - distB;
    });
    return sorted;
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctorsBySpecialization(specialization, 50);

        // Sort the fetched data by distance before setting state
        const sortedData = sortDoctorsByDistance(data);

        setDoctors(sortedData);
        setFilteredDoctors(sortedData); // Update filtered doctors with sorted data
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [specialization, user?.latitude, user?.longitude]); // Re-fetch/sort if user location changes

  // Add search functionality
  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text === '') {
      setFilteredDoctors(doctors); // Revert to the full sorted list
    } else {
      // Filter the already sorted 'doctors' array
      const filtered = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(text.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  };

  const renderItem = ({ item }) => (
    <View className="flex-row mb-4 p-3 bg-[#E9FAFD] rounded-xl">
      <Image
        source={{ uri: item.imageUrl || 'https://via.placeholder.com/80' }}
        className="w-[80px] h-[80px] rounded-full mt-8"
      />
      <View className="flex-1 ml-3 justify-center">
        <View className="flex-row items-center mb-1">
          <Ionicons name="person" size={16} color="#00BCD4" />
          <Text className="text-base font-semibold ml-1">{item.name}</Text>
        </View>

        <View className="flex-row items-center mb-1">
          <Ionicons name="medical" size={16} color="orange" />
          <Text className="text-sm text-gray-500 ml-1 font-bold">Specialization: {item.specialization}</Text>
        </View>

        <View className="flex-row items-center mb-1">
          <Ionicons name="time" size={16} color="#666" />
          <Text className="text-sm text-gray-600 ml-1">Experience: {item.experience} years</Text>
        </View>


        <View className="flex-row items-center mb-2">
          <Ionicons name="calendar" size={16} color="#666" />
          <Text className="text-sm text-gray-600 ml-1">
            Time-slots: {Array.isArray(item.availableTimeSlots) ? item.availableTimeSlots.join(', ') : item.availableTimeSlots}
          </Text>
        </View>

        <View className="flex-row items-center mb-1">
          <Ionicons name="cash" size={16} color="#666" />
          <Text className="text-sm text-gray-600 ml-1 font-bold">&#x20B9; {item.fees}</Text>
        </View>

        <View className="flex-row justify-between mt-2">
          <TouchableOpacity
            onPress={() => router.push(`/doctor-profile/${item._id}`)}
            className="bg-[#00BCD4] px-4 py-1.5 rounded-full flex-row items-center"
          >
            <Ionicons name="eye" size={14} color="white" />
            <Text className="text-white text-xs font-medium ml-1">View Detail</Text>
          </TouchableOpacity>
          <View className="flex-row items-center">
            <Ionicons name="star" size={16} color="#FF9800" />
            <Text className="text-[#FF9800] text-sm font-medium ml-1">{item.rating}</Text>
          </View>
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

      {/* Search Bar */}
      <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-4">
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          className="flex-1 ml-2 text-base"
          placeholder="Search doctors..."
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default DoctorsBySpecialization;