import React from 'react';
import { View, Text, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import bannerImage from '../../assets/images/bannerdoctor.png';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const handleSeeAllDoctors = () => {
    console.log("Navigating to /all-doctors");
    router.push('/all-doctors');
  };

  return (
    <ScrollView className="p-4 bg-white">
      {/* Profile Header */}
      <View className="mt-14 flex-row items-center mb-5">
        <Image
          source={{ uri: 'https://via.placeholder.com/40' }}
          className="w-[70px] h-[70px] rounded-2xl mr-3"
        />
        <View>
          <Text className="text-xs text-gray-500 font-['Poppins-Regular']">Hi, Welcome Back,</Text>
          <Text className="w-[150px] text-base text-black font-['Poppins-Bold']">John Doe William</Text>
        </View>
        <Ionicons name="notifications-outline" size={24} color="black" className="ml-auto" />
      </View>

      {/* Search Bar */}
      <View className=" h-[60px] flex-row items-center bg-gray-200 rounded-xl px-3 py-2 mb-10 mx-1">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput placeholder="Search a Doctor" className="ml-2 flex-1 font-['Poppins-Regular']" />
      </View>

      {/* Banner */}
      <View className="h-[180px] flex-row bg-[#0B8FAC] rounded-xl p-4 mb-10 mx-1 items-start">
        <View className="flex-1">
          <Text className="text-white text-base mb-1 font-['Poppins-Bold']">Medical Center</Text>
          <Text className="text-white text-xs font-['Poppins-Regular']">
            Yorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.
          </Text>
        </View>
        <Image source={bannerImage} className="w-20 h-20 rounded-lg ml-3" />
      </View>

      {/* Categories */}
      <View className="flex-row justify-between items-center px-4 mb-3">
        <Text className="text-base font-['Poppins-Bold']">Categories</Text>
        <TouchableOpacity>
          <Text className="text-[#2DBFE6] font-['Poppins-Regular']">See All</Text>
        </TouchableOpacity>
      </View>
      <View className=" h-[80px] flex-row gap-2 px-4 mb-10">
        <Text className=" w-[160px] bg-[#7BC1B7] text-center pt-6 rounded-lg w-[120px] h-20 font-['Poppins-Medium']">Denteeth</Text>
        <Text className=" w-[160px] bg-[#7BC1B7] text-center pt-6 rounded-lg w-[120px] h-20 font-['Poppins-Medium']">Theripist</Text>
        <Text className=" w-[160px] bg-[#7BC1B7] text-center pt-6 rounded-lg w-[120px] h-20 font-['Poppins-Medium']">Surgeon</Text>
      </View>

      {/* All Doctors */}
      <View className="flex-row justify-between items-center px-4 mb-2">
        <Text className="text-base font-['Poppins-Bold']">All Doctors</Text>
        <TouchableOpacity onPress={handleSeeAllDoctors}>
          <Text className="text-[#2DBFE6] font-['Poppins-Regular']">See All</Text>
        </TouchableOpacity>
      </View>

      {/* Doctor Card */}
      <View className="h-[180px] flex-row bg-[#D2EBE74D] rounded-xl p-3 mb-5 mx-1 items-center">
        <Image source={bannerImage} className="w-12 h-10 rounded-full mr-3" />
        <View className="flex-1">
          <Text className="text-sm font-['Poppins-Bold']">Dr. Pawan</Text>
          <Text className="text-xs text-gray-600 font-['Poppins-Regular']">
            Lorem ipsum dolor, consectetur adipiscing elit.
          </Text>
        </View>
        <TouchableOpacity className="bg-[#2DBFE6] px-3 py-1 rounded-lg ml-2">
          <Text className="text-white text-xs font-['Poppins-Medium']">Book</Text>
        </TouchableOpacity>
        <View className="flex-row items-center ml-2">
          <FontAwesome name="star" size={16} color="#FFA500" />
          <Text className="text-xs ml-1 font-['Poppins-Regular']">5.0</Text>
        </View>
      </View>
    </ScrollView>
  );
}
