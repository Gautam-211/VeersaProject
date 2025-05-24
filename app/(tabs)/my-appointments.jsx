import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { getAppointmentsByUser } from '../../lib/api2';
import { useGlobalContext } from '../../context/GlobalProvider';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

// Icons as in your original code
const CalendarIcon = () => (
  <Text className="text-xs text-gray-500">📅</Text>
);
const ClockIcon = () => (
  <Text className="text-xs text-gray-500">🕐</Text>
);
const LocationIcon = () => (
  <Text className="text-xs text-gray-500">📍</Text>
);
const DoctorIcon = () => (
  <Text className="text-xs text-gray-500">👨‍⚕️</Text>
);

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const {user} = useGlobalContext();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const data  = await getAppointmentsByUser(user._id);
      setTimeout(() => {
        setAppointments(data); // Replace with sampleAppointments for demo
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to fetch appointments');
    }
  };

  const filteredAppointments = appointments.filter(appointment =>
    appointment.doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
    appointment.reason.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // This returns tailwind class names instead of objects!
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return { badge: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' };
      case 'pending':
        return { badge: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-400' };
      case 'completed':
        return { badge: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' };
      case 'cancelled':
        return { badge: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' };
      default:
        return { badge: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-400' };
    }
  };

  const handleAppointmentClick = (appointmentId) => {
    router.push(`/my-appointments/${appointmentId}`);
  };

  const renderAppointmentCard = (appointment) => {
    const statusStyle = getStatusStyle(appointment.status);
    return (
      <TouchableOpacity
        key={appointment._id}
        className="bg-white rounded-2xl mb-4 shadow"
        onPress={() => handleAppointmentClick(appointment._id)}
        activeOpacity={0.7}
      >
        <View className="flex-row p-4">
          {/* Doctor Image and Status Dot */}
          <View className="relative mr-4">
            <Image
              source={{ uri: appointment.doctor.imageUrl }}
              className="w-16 h-16 rounded-full"
            />
            <View className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white ${statusStyle.dot}`} />
          </View>
          {/* Details */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-base font-semibold text-gray-900 flex-1 mr-2" numberOfLines={1}>
                {appointment.doctor.name}
              </Text>
              <View className={`px-2 py-1 rounded-xl ${statusStyle.badge}`}>
                <Text className={`text-xs font-medium ${statusStyle.text}`}>
                  {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center mb-1.5">
              <DoctorIcon />
              <Text className="text-sm text-gray-500 ml-1 flex-1" numberOfLines={1}>
                {appointment.doctor.specialization}
              </Text>
              <Text className="text-sm text-gray-500 ml-1">
                • {appointment.doctor.experience} years exp
              </Text>
            </View>
            <View className="flex-row items-center mb-1.5">
              <CalendarIcon />
              <Text className="text-sm text-gray-500 ml-1 mr-3">{formatDate(appointment.date)}</Text>
            </View>
            <View className="flex-row items-center mb-1.5">
              <LocationIcon />
              <Text className="text-sm text-gray-500 ml-1 flex-1" numberOfLines={1}>
                {appointment.doctor.address}
              </Text>
            </View>
            <View className="flex-row items-center mb-1.5">
                <ClockIcon />
              <Text className="text-sm text-gray-500 ml-1">{appointment.timeSlot}</Text>
            </View>
            <View className="flex-row mt-2 mb-1">
              <Text className="text-sm text-gray-500">Reason: </Text>
              <Text className="text-sm text-gray-900 font-medium flex-1">{appointment.reason}</Text>
            </View>
            {appointment.symptoms && (
              <Text className="text-xs text-gray-400 mb-2">
                Symptoms: {appointment.symptoms}
              </Text>
            )}
            <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <Text className="text-base font-semibold text-gray-900">
                ₹{appointment.doctor.fees}
              </Text>
              <Text className="text-sm text-teal-600 font-medium">View Details</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Header */}
      <View className="bg-white px-4 py-4 shadow mb-0 z-10">
          <Text className="text-3xl font-semibold text-center mt-8 mb-6">My Appointments</Text>
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-3 h-12">
            <Ionicons name="search" size={20} color="gray" />

          <TextInput
            className="flex-1 text-base text-gray-900"
            placeholder="Search appointments..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>
      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="flex-1 justify-center items-center py-16">
            <ActivityIndicator size="large" color="#0D9488" />
          </View>
        ) : filteredAppointments.length === 0 ? (
          <View className="flex-1 justify-center items-center py-16">
            <Text className="text-base text-gray-400">No appointments found</Text>
          </View>
        ) : (
          filteredAppointments.map(renderAppointmentCard)
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Appointments;