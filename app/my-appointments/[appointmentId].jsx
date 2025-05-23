import { View, Text, ActivityIndicator, ScrollView, Linking, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { getAppointmentByAppointmentId } from '../../lib/api2'; // Adjust path as needed

const statusStyles = {
  confirmed: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
  pending:   { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-200" },
  completed: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
  cancelled: { bg: "bg-red-100", text: "text-red-700", border: "border-red-200" },
  default:   { bg: "bg-gray-200", text: "text-gray-700", border: "border-gray-200" }
};

const humanize = v => (!v || v===null || v==="null") ? <Text className="italic text-gray-400">N/A</Text> : v;

const AppointmentDetails = () => {
  const { appointmentId } = useLocalSearchParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const data = await getAppointmentByAppointmentId(appointmentId);
        setAppointment(data);
      } catch (error) {
        console.error('Failed to load appointment:', error);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) fetchAppointment();
  }, [appointmentId]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!appointment) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-base text-red-600">Appointment not found.</Text>
      </View>
    );
  }

  const { doctor, date, timeSlot, reason, symptoms, notes, drivingLink, status } = appointment;
  const statusStyle = statusStyles[status?.toLowerCase?.()] || statusStyles.default;

  return (
  <SafeAreaView className="flex-1 bg-white">
    <Text className="text-3xl font-semibold text-center mt-8 mb-6">Appointment Details</Text>
    
    <ScrollView contentContainerStyle={{ padding: 16, backgroundColor: '#F3F4F6', minHeight: '100%' }}>
      {/* Card container */}
      <View className="bg-white rounded-2xl shadow-md px-5 py-6 mb-6 border border-gray-100">
        {/* DOCTOR HEADER */}
        <View className="items-center mb-4">
          <Image
            source={doctor?.imageUrl ? { uri: doctor.imageUrl } : require('../../assets/images/bannerdoctor.png')}
            className="w-28 h-28 rounded-full mb-2 bg-gray-100"
            style={{ resizeMode: 'cover' }}
          />
          <Text className="text-xl font-bold text-gray-900">{humanize(doctor?.name)}</Text>
          <Text className="text-base text-gray-500">{humanize(doctor?.specialization)}</Text>
        </View>

        {/* Divider  */}
        <View className="w-full h-px border-t border-dashed border-gray-200 mb-4" />

        {/* Doctor Details Info */}
        <View className="mb-2">
          <Text className="text-md font-semibold text-gray-700 mb-1">👨‍⚕️ Experience:</Text>
          <Text className="text-base text-gray-900 mb-2">{humanize(doctor?.experience ? `${doctor?.experience} years` : null)}</Text>
          <Text className="text-md font-semibold text-gray-700 mb-1">🏥 Address:</Text>
          <Text className="text-base text-gray-900">{humanize(doctor?.address)}</Text>
        </View>

        {/* Appointment Info */}
        <View className="mt-6">
          <Text className="text-lg font-bold text-blue-900 mb-3">Appointment Details</Text>
          <View className="flex-row items-center mb-2">
            <Text className="text-md font-semibold text-gray-700 mr-2">📅 Date:</Text>
            <Text className="text-base text-gray-900">{date ? new Date(date).toDateString() : <Text className="italic text-gray-400">N/A</Text>}</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Text className="text-md font-semibold text-gray-700 mr-2">⏰ Time:</Text>
            <Text className="text-base text-gray-900">{humanize(timeSlot)}</Text>
          </View>
          <View className="flex-row items-center mb-2">
            <Text className="text-md font-semibold text-gray-700 mr-2">📊 Status:</Text>
            <View className={`px-3 py-1 rounded-xl ${statusStyle.bg} ${statusStyle.border} border`}>
              <Text className={`font-semibold capitalize text-xs ${statusStyle.text}`}>{status || "N/A"}</Text>
            </View>
          </View>
          <View className="flex-row items-center mb-2">
            <Text className="text-md font-semibold text-gray-700 mr-2">📖 Reason:</Text>
            <Text className="text-base text-gray-900">{humanize(reason)}</Text>
          </View>
          {symptoms ? (
            <View className="flex-row items-center mb-2">
              <Text className="text-md font-semibold text-gray-700 mr-2">💡 Symptoms:</Text>
              <Text className="text-base text-gray-900">{humanize(symptoms)}</Text>
            </View>
          ) : null}
          {notes ? (
            <View className="mb-2">
              <View className="flex-row items-center mb-1">
                <Text className="text-md font-semibold text-gray-700 mr-2">📝 Notes:</Text>
              </View>
              <Text className="text-base text-gray-900">{humanize(notes)}</Text>
            </View>
          ) : null}

          {/* Directions Button */}
          {drivingLink ? (
            <TouchableOpacity
              className="mt-5"
              onPress={() => Linking.openURL(drivingLink)}
              activeOpacity={0.8}
            >
              <View className="flex-row items-center px-4 py-2 rounded-lg bg-blue-600 justify-center">
                <Text className="text-white text-base font-semibold mr-1">📍 Get Directions</Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
};

export default AppointmentDetails;