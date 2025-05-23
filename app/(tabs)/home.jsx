import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import bannerImage from '../../assets/images/bannerdoctor.png';
import { useRouter } from 'expo-router';
import { getAllDoctors } from '../../lib/api1';
import { useGlobalContext } from "../../context/GlobalProvider";


export default function HomeScreen() {
   const { user } = useGlobalContext();
  const [doctors, setDoctors] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getAllDoctors();
        setDoctors(data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleSeeAllDoctors = () => {
    router.push('/all-doctors/allDoctors');
  };

  return (
    <ScrollView className="p-4 bg-white">
      {/* Header */}
      <View className="mt-14 flex-row items-center mb-5 px-4">
        <Image
          source={{ uri: 'https://via.placeholder.com/70' }}
          className="w-[70px] h-[70px] rounded-2xl mr-3"
        />
        <View>
          <Text className="text-xs text-gray-500 font-['Poppins-Regular']">
            Hi, Welcome Back ,{user.email}
          </Text>
          <Text className="w-[150px] text-base text-black font-['Poppins-Bold'] font-bold">
            {user.name}
          </Text>
        </View>
        <Ionicons
          name="notifications-outline"
          size={24}
          color="black"
          className="ml-auto"
        />
      </View>

      {/* Search Bar */}
      <View className="h-[60px] flex-row items-center bg-gray-200 rounded-xl px-3 py-2 mb-10 mx-1">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search a Doctor"
          className="ml-2 flex-1 font-['Poppins-Regular']"
        />
      </View>

      {/* Banner */}
      <View className="h-[180px] flex-row bg-[#0B8FAC] rounded-xl p-4 mb-10 mx-1 items-start">
        <View className="flex-1">
          <Text className="text-white text-base mb-1 font-['Poppins-Bold']">
            Medical Center
          </Text>
          <Text className="text-white text-xs font-['Poppins-Regular']">
            Yorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            vulputate libero et velit interdum, ac aliquet odio mattis.
          </Text>
        </View>
        <Image
          source={bannerImage}
          className="w-[80px] h-[150px] rounded-full ml-3"
        />
      </View>

      {/* Categories */}
      <View className="flex-row justify-between items-center px-4 mb-3">
        <Text className="text-base font-['Poppins-Bold']">Categories</Text>
        <TouchableOpacity>
          <Text className="text-[#2DBFE6] font-['Poppins-Regular']">
            See All
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  className="h-[80px] px-4 mb-5"
>
  <TouchableOpacity className="w-[120px] h-[50px] bg-[#7BC1B7] text-center pt-3 rounded-lg mr-2">
    <Text className="text-center font-['Poppins-Medium']">Cardiology</Text>
  </TouchableOpacity>
  <TouchableOpacity className="w-[120px] h-[50px] bg-[#7BC1B7] text-center pt-3 rounded-lg mr-2">
    <Text className="text-center font-['Poppins-Medium']">Dermatology</Text>
  </TouchableOpacity>
  <TouchableOpacity className="w-[120px] h-[50px] bg-[#7BC1B7] text-center pt-3 rounded-lg mr-2">
    <Text className="text-center font-['Poppins-Medium']">Ent</Text>
  </TouchableOpacity>
  <TouchableOpacity className="w-[120px] h-[50px] bg-[#7BC1B7] text-center pt-3 rounded-lg mr-2">
    <Text className="text-center font-['Poppins-Medium']">Gynecology</Text>
  </TouchableOpacity>
  <TouchableOpacity className="w-[120px] h-[50px] bg-[#7BC1B7] text-center pt-3 rounded-lg mr-2">
    <Text className="text-center font-['Poppins-Medium']">Neurology</Text>
  </TouchableOpacity>
  <TouchableOpacity className="w-[120px]  h-[50px] bg-[#7BC1B7] text-center pt-3 rounded-lg mr-2">
    <Text className="text-center font-['Poppins-Medium']">Ophthalmology</Text>
  </TouchableOpacity>
  <TouchableOpacity className="w-[120px] h-[50px] bg-[#7BC1B7] text-center pt-3 rounded-lg mr-2">
    <Text className="text-center font-['Poppins-Medium']">Orthopedics</Text>
  </TouchableOpacity>
  <TouchableOpacity className="w-[120px] h-[50px] bg-[#7BC1B7] text-center pt-3 rounded-lg mr-2">
    <Text className="text-center font-['Poppins-Medium']">Pediatrics</Text>
  </TouchableOpacity>
  <TouchableOpacity className="w-[120px] h-[50px] bg-[#7BC1B7] text-center pt-3 rounded-lg mr-2">
    <Text className="text-center font-['Poppins-Medium']">Psychiatry</Text>
  </TouchableOpacity>
  <TouchableOpacity className="w-[120px] h-[50px] bg-[#7BC1B7] text-center pt-3 rounded-lg">
    <Text className="text-center font-['Poppins-Medium']">Urology</Text>
  </TouchableOpacity>
</ScrollView>


      {/* All Doctors */}
      <View className="flex-row justify-between items-center px-4 mb-2">
        <Text className="text-base font-['Poppins-Bold']">All Doctors</Text>
        <TouchableOpacity onPress={handleSeeAllDoctors}>
          <Text className="text-[#2DBFE6] font-['Poppins-Regular']">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Doctor Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-4 pr-2 mb-10"
      >
        {doctors.slice(0, 5).map((doctor, index) => (
          <View
            key={index}
            className=" flex-row mr-3 w-[250px] p-3 bg-[#E9FAFD] rounded-xl"
          >
            <Image
              source={{uri:doctor.imageUrl}}
              className="w-[80px] h-[170px] rounded-full"
            />
            <View className="ml-3 justify-center">
              <Text className="text-base font-semibold font-[Poppins-SemiBold]">
                {doctor.name || 'Dr. Kevin'}
              </Text>
              <Text className="text-xs mt-1 mb-2 font-light font-[Poppins-Light]">
                {doctor.specialization || 'Dermatologist'}
              </Text>
              <Text className="text-base font-semibold font-[Poppins-SemiBold] mb-2">
                {doctor.experience || '2'} years experience
              </Text>
              <Text className="text-xs mt-1 mb-2 font-light font-[Poppins-Light]">
                <FontAwesome name="rupee" size={15} color="black" />{' '}
                {doctor.fees || 832}
              </Text>
              <View className="flex-row justify-between items-center">
                <TouchableOpacity className="bg-[#00BCD4] px-4 py-1.5 rounded-full mt-4">
                  <Text className="text-white text-xs font-medium font-[Poppins-Medium]">
                    Book
                  </Text>
                </TouchableOpacity>
                <Text className="text-[#FF9800] text-sm font-medium font-[Poppins-Medium]">
                  ⭐
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}
