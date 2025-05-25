import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { getAllDoctors } from '../../lib/api1';
import { Ionicons } from '@expo/vector-icons';
import { useGlobalContext } from '../../context/GlobalProvider'; // Corrected import for useGlobalContext

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

const AllDoctors = () => {
  const { user } = useGlobalContext(); // Get user from global context
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
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

  const fetchDoctors = async (currentPage) => {
    try {
      const data = await getAllDoctors(currentPage, 20);
      if (data.length < 20) setHasMore(false);

      setDoctors(prev => {
        const existingIds = prev.map(doctor => doctor._id);
        const newDoctors = data.filter(doctor => !existingIds.includes(doctor._id));
        const combinedDoctors = [...prev, ...newDoctors];
        return sortDoctorsByDistance(combinedDoctors); // Sort combined doctors
      });

      // If no search term, update filteredDoctors with the newly sorted and combined list
      if (searchTerm === '') {
        setFilteredDoctors(prev => {
          const existingIds = prev.map(doctor => doctor._id);
          const newDoctors = data.filter(doctor => !existingIds.includes(doctor._id));
          const combinedDoctors = [...prev, ...newDoctors];
          return sortDoctorsByDistance(combinedDoctors); // Sort combined doctors
        });
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchDoctors(page);
  }, [page, user?.latitude, user?.longitude]); 

  const handleSearch = (text) => {
    setSearchTerm(text);
    if (text === '') {
      // If search term is cleared, revert to the full sorted list
      setFilteredDoctors(doctors);
    } else {
      // Filter the already sorted 'doctors' array
      const filtered = doctors.filter(doctor =>
        doctor.name.toLowerCase().includes(text.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  };

  useEffect(() => {
    // When the 'doctors' array changes (e.g., new data fetched or sorted),
    // and if there's no active search term, update filteredDoctors.
    if (searchTerm === '') {
      setFilteredDoctors(doctors);
    }
  }, [doctors, searchTerm]);

  const loadMoreDoctors = () => {
    if (hasMore && !loadingMore) {
      setLoadingMore(true);
      setPage(prev => prev + 1);
    }
  };

  const renderItem = ({ item }) => (
    <SafeAreaView>
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

        <View className="flex-row items-center mb-1">
          <Ionicons name="calendar" size={16} color="#666" />
          <Text className="text-sm text-gray-600 ml-1">
            Time-slots: {Array.isArray(item.availableTimeSlots) ? item.availableTimeSlots.join(', ') : item.availableTimeSlots}
          </Text>
        </View>

        <View className="flex-row items-center mb-2">
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
            <Text className="text-[#FF9800] text-sm font-medium ml-1 mr-2 ">{item.rating}</Text>
          </View>
        </View>
      </View>
    </View>
    </SafeAreaView>
  );

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <TouchableOpacity
        onPress={loadMoreDoctors}
        className="my-4 py-2 bg-[#00BCD4] rounded-full items-center"
        disabled={loadingMore}
      >
        {loadingMore ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-medium ">Load More</Text>
        )}
      </TouchableOpacity>
    );
  };

  if (loading && doctors.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#00BCD4" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white ">
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4 text-center mt text-cyan-600">All Doctors</Text>

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
        ListFooterComponent={renderFooter}
      />
    </View>
    </SafeAreaView>
  );
};

export default AllDoctors;