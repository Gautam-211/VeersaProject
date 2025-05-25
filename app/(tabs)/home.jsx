import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAllDoctors } from '../../lib/api1'; // Assuming api1 is correct
import { useGlobalContext } from "../../context/GlobalProvider"; // Assuming GlobalProvider is correct
import { categories } from '../../constants/constant'; // Assuming categories constant is correct
import userImage from '../../assets/images/user.png';
import bannerImage from '../../assets/images/bannerdoctor.png'; // Your existing banner image

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
        alert("there is error in this page !")
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleSeeAllDoctors = () => {
    router.push('/all-doctors/allDoctors');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
    <ScrollView className="p-4 bg-white">
      <View className="mt-10 flex-row items-center mb-5 px-2">
        <Image
          source={userImage} 
          className="w-[70px] h-[70px] rounded-full mr-4" 
        />
        <View>
          <Text className="text-sm text-gray-600 font-semibold font-medium">
            Hi, Welcome Back ,
          </Text>
          <Text className="w-[150px] text-lg text-black font-large "> 
            {user?.name || 'John Doe William'} 
          </Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Notifications', 'No new notifications yet!')} className="ml-auto">
          <Ionicons
          name="notifications-outline"
          size={24}
          color="black"
          className="ml-auto"
        />
        </TouchableOpacity>
        
      </View>

      {/* Search Bar */}
      <View className="h-[60px] flex-row items-center bg-gray-200 rounded-xl px-3 py-2 mb-10 mx-1">
        <Ionicons name="search" size={20} color="gray" />
        <TextInput
          placeholder="Search a Doctor"
              placeholderTextColor={"#6b7280"}
          className="ml-2 flex-1 font-['Poppins-Regular'] text-black"
        />
        {/* Microphone icon added */}
        <Ionicons name="mic-outline" size={20} color="gray" className="ml-2" />
      </View>

      {/* Banner */}
     <View className="h-[180px] flex-row bg-[#0B8FAC] rounded-xl p-4 mb-10 mx-1 items-start">
        <View className="flex-1">
          <Text className="text-white text-lg mb-2 font-['Poppins-Bold'] font-bold">
            Medical Center
          </Text>
          {/* Quotes added here */}
          <Text className="text-white text-xs font-medium mb-1">
            • Healing hands, compassionate hearts.
          </Text>
          <Text className="text-white text-xs font-medium mb-1">
            • In every diagnosis, a promise of hope.
          </Text>
          <Text className="text-white text-xs font-medium">
            • Guardians of well-being, champions of life.
          </Text>
        </View>
        <Image
          source={bannerImage}
          className="w-[100px] h-[150px] rounded-xl ml-3"
        />
      </View>

      {/* Categories */}
      <View className="flex-row justify-between items-center px-4 mb-3">
        <Text className="text-cyan-500 font-medium">Categories</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="h-[60px] px-4 mb-5 mt-8" 
      >
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            className="w-[150px] h-[50px] bg-[#7BC1B7] justify-center items-center rounded-lg mr-2" // Wider, centered text
            onPress={() => router.push(`/categories/${category}`)}
          >
            <Text className="text-center font-['Poppins-Medium'] font-semibold text-white font-semibold">
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* All Doctors */}
      <View className="flex-row justify-between items-center px-4 mb-2">
        <Text className="text-cyan-500 font-medium">All Doctors</Text>
        <TouchableOpacity onPress={handleSeeAllDoctors}>
          <Text className="text-cyan-500 font-medium">
            See All
          </Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Doctor Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="pl-4 pr-2 mb-10 mt-8"
      >
        {doctors.slice(0, 5).map((doctor, index) => (
          <View
            key={index}
            className="w-[375px] h-[180px] flex-row mr-3 w-[280px] p-3 bg-[#E9FAFD] rounded-xl" // Adjusted width for design fit
          >
            <Image
              source={{uri:doctor.imageUrl}} 
              className="w-[80px] h-[80px] rounded-full mt-8" // Adjusted size and rounding for design
            />
            <View className="flex-1 ml-3 justify-center">
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="person" size={16} color="#00BCD4" />
                      <Text className="text-base font-semibold ml-1">{doctor.name}</Text>
                    </View>
                    
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="medical" size={16} color="orange" />
                      <Text className="text-sm text-gray-500 ml-1 font-bold">Specialization: {doctor.specialization}</Text>
                    </View>
                    
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="time" size={16} color="#666" />
                      <Text className="text-sm text-gray-600 ml-1">Experience: {doctor.experience} years</Text>
                    </View>
                    
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="calendar" size={16} color="#666" />
                      <Text className="text-sm text-gray-600 ml-1">
                        Time-slots: {Array.isArray(doctor.availableTimeSlots) ? doctor.availableTimeSlots.join(', ') : doctor.availableTimeSlots}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="cash" size={16} color="#666" />
                      <Text className="text-sm text-gray-600 ml-1 font-bold">&#x20B9; {doctor.fees}</Text>
                    </View>
                    
                    <View className="flex-row justify-between mt-2">
                      <TouchableOpacity
                        onPress={() => router.push(`/doctor-profile/${doctor._id}`)}
                        className="bg-[#00BCD4] px-4 py-1.5 rounded-full flex-row items-center"
                      >
                        <Ionicons name="eye" size={14} color="white" />
                        <Text className="text-white text-xs font-medium ml-1">View Detail</Text>
                      </TouchableOpacity>
                      <View className="flex-row items-center mb-2">
                        <Ionicons name="star" size={16} color="#FF9800" />
                        <Text className="text-[#FF9800] text-sm font-medium ml-1 mr-2 ">{doctor.rating}</Text>
                      </View>
                    </View>
                  </View>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
    </SafeAreaView>
  );
}
