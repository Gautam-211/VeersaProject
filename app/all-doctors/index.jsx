import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAllDoctors } from '../../lib/api';
import { useNavigation } from 'expo-router'; // Assuming useNavigation is still needed for other purposes, though not directly used in this snippet.
import Image1 from '../../assets/images/Image1.png';
import Image2 from '../../assets/images/Image2.png'; 
import Image3 from '../../assets/images/Image3.png'; 
import Image4 from '../../assets/images/Image4.png';
import Image5 from '../../assets/images/bannerdoctor.png';
import { useRouter } from 'expo-router';
const doctorImages = [Image1, Image2, Image3, Image4, Image5];
const AllDoctors = () => {
    const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAllDoctors();
        const doctorsWithImages = result.map(doctor => ({
          ...doctor,
          randomImage: doctorImages[Math.floor(Math.random() * doctorImages.length)]
        }));
        setDoctors(doctorsWithImages);
      } catch (error) {
        console.error("Failed to fetch doctors:", error); 
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View className="flex-row mb-4 p-3 bg-[#E9FAFD] rounded-xl">
      {/* Use the randomImage property assigned to each item */}
      <Image source={item.randomImage} className="w-[70px] h-[170px] rounded-full" />
      <View className="flex-1 ml-3 justify-center">
        <Text className="text-base font-semibold font-[Poppins-SemiBold]">{item.name}</Text>
        <Text className="text-xs mt-1 mb-2 font-light font-[Poppins-Light]">Specialization:{item.specialization}</Text>
        <Text className="text-base font-semibold font-[Poppins-SemiBold]">Experience:{item.experience}</Text>
        <Text className="text-xs mt-1 mb-2 font-light font-[Poppins-Light]">Time-slots:{item.availableTimeSlots}</Text>
        <Text className="text-xs mt-1 mb-2 font-light font-[Poppins-Light]">{item.fees}</Text>
        <View className="flex-row justify-between items-center">
          <TouchableOpacity className="bg-[#00BCD4] px-4 py-1.5 rounded-full" onPress={() => router.push(`/doctor-profile/${item._id}`)}>
            <Text className="text-white text-xs font-medium font-[Poppins-Medium]">Book</Text>
          </TouchableOpacity>
          <Text className="text-[#FF9800] text-sm font-medium font-[Poppins-Medium]">⭐ {item.rating}</Text>
        </View>
      </View>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" color="#00BCD4" className="mt-12" />;

  return (
    <View className="flex-1 p-4 bg-white">
      <FlatList
        data={doctors}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListHeaderComponent={<Text className="text-xl font-bold mb-4 text-center font-[Poppins-Bold]">All Doctors</Text>}
      />
    </View>
  );
};

export default AllDoctors;
