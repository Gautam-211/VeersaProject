import React, { useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router'; 
import { useGlobalContext } from '../../context/GlobalProvider'; 

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  const { setRecentAppointment } = useGlobalContext(); 

  useEffect(() => {
    if (params && params.appointmentId) { 
      setRecentAppointment({
        id: params.appointmentId, 
        doctorId: params.doctorId,
        userId: params.userId,
        date: params.date,
        timeSlot: params.timeSlot,
        reason: params.reason,
        symptoms: params.symptoms,
        notes: params.notes,
        drivingLink: params.drivingLink,
        doctorName: params.doctorName,
        doctorSpecialization: params.doctorSpecialization,
        doctorExperience: params.doctorExperience,
        doctorFees: params.doctorFees,
        doctorImageUrl: params.doctorImageUrl,
      });
    //   console.log("Appointment stored in context:", params.appointmentId);
    }

    const timer = setTimeout(() => {
      router.replace('/my-appointments')
    }, 2000); 

    return () => clearTimeout(timer);
  }, [params.appointmentId]); 

  return (
    <View className="flex-1 bg-white justify-center items-center p-4">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View className="w-40 h-40 rounded-full bg-[#7BC1B7] justify-center items-center mb-8">
        <Ionicons name="checkmark" size={100} color="white" />
      </View>
      <Text className="text-3xl font-bold text-[#0B8FAC] mb-2">
        Congratulations
      </Text>

      {/* Success Message */}
      <Text className="text-lg text-gray-700 text-center">
        Your Payment Is Successfully
      </Text>
      <TouchableOpacity onPress={()=>router.push('/my-appointments')}>
        <Text className="text-xl font-bold mb-4 text-center mt-10 text-cyan-600 mt-10">
          Back to my appointments
        </Text>
      </TouchableOpacity>
    </View>
  );
}
