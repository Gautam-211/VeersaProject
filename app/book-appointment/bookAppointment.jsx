import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert } from "react-native"; // Added Alert
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { doctorProfile } from "../../lib/api1";
import { useRouter } from 'expo-router';
import axios from "axios";
import {
  startOfMonth,
  endOfMonth,
  getDay,
  addDays,
  isSameDay,
  format,
  isSameMonth,
  startOfWeek,
  isPast,
} from "date-fns";
import { useGlobalContext } from "../../context/GlobalProvider";

export default function BookAppointment() {
  const router = useRouter();
  const { doctorId } = useLocalSearchParams();
  const [doctor, setDoctor] = useState(null);
  const { user } = useGlobalContext(); // Get user from global context
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [notes, setNotes] = useState("");
  const symptoms = [
    "Fever",
    "Headache",
    "Cough",
    "Body Pain",
    "Fatigue"
  ];

  const fetchDoctor = async () => {
    try {
      setLoadingDoctor(true);
      const data = await doctorProfile(doctorId);
      setDoctor(data);
    } catch (err) {
      console.error("API error fetching doctor data:", err.message);
      Alert.alert("Error", "Failed to load doctor details."); 
    } finally {
      setLoadingDoctor(false);
    }
  };

  const generateCalendar = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfCurrentMonth = startOfMonth(today);
    const startDayOfCalendar = startOfWeek(startOfCurrentMonth, { weekStartsOn: 0 });

    const daysArray = [];
    for (let i = 0; i < 42; i++) {
      const day = addDays(startDayOfCalendar, i);
      daysArray.push(day);
    }
    setCalendarDays(daysArray);
  };

  useEffect(() => {
    if (doctorId) {
      fetchDoctor();
    }
    generateCalendar();
  }, [doctorId]);

  const isAvailableDay = (date) => {
    if (!doctor?.availableDays || !date) return false;
    const dayName = format(date, "EEEE");
    return doctor.availableDays.some(
      (d) => d.toLowerCase() === dayName.toLowerCase()
    );
  };

  const calendarWeeks = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    calendarWeeks.push(calendarDays.slice(i, i + 7));
  }

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedSlot || !reason || !selectedSymptom) {
      Alert.alert("Missing Information", "Please fill in all required fields (Date, Time Slot, Reason, Symptom).");
      return;
    }
    if (!user?.latitude || !user?.longitude || !doctor?.latitude || !doctor?.longitude) {
      Alert.alert("Location Missing", "Location coordinates missing for user or doctor. Cannot generate driving link.");
      return;
    }
    const drivingLink = `http://maps.google.com/maps?saddr=${user.latitude},${user.longitude}&daddr=${doctor.latitude},${doctor.longitude}&dirflg=d`;
    const appointmentData = {
      doctorId: doctor._id, // Ensure doctor._id is available
      userId: user._id, // Ensure user._id is available
      date: format(selectedDate, 'yyyy-MM-dd'),
      timeSlot: selectedSlot,
      reason,
      symptoms: selectedSymptom,
      notes,
      drivingLink,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      doctorExperience: doctor.experience,
      doctorFees: doctor.fees,
      doctorImageUrl: doctor.imageUrl || 'https://via.placeholder.com/80',
    };

    try {
      // console.log("Appointment Data:", appointmentData);
      const response = await axios.post('https://veersa-backend.onrender.com/api/appointments', appointmentData);
      const bookedAppointmentId = response.data._id;
      router.push({
        pathname: '/payment-screen/payment',
        params: {
          ...appointmentData, // Pass all appointment data
          appointmentId: bookedAppointmentId, // Pass the ID from the backend
        },
      });
      // Alert.alert("Success", "Appointment booked successfully! Proceeding to payment.");
    } catch (error) {
      console.error("Error booking appointment:", error);
      Alert.alert("Booking Failed", "Failed to book appointment. Please try again.");
    }
  };


  if (loadingDoctor) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#06b6d4" />
        <Text className="text-gray-500 mt-2">Loading doctor availability...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-3 mt-10 text-center text-cyan-600">Fill all Inputs</Text>
      <View className="mb-4">
        <Text className="text-base font-semibold mb-2">Reason for Visit</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
          placeholder="Enter reason for visit"
          value={reason}
          onChangeText={setReason}
        />
      </View>

      {/* Month and Year Header */}
      <Text className="text-lg font-bold text-center mb-4">
        {format(new Date(), 'MMMM yyyy')} {/* Corrected: Changed 'MMMM FF' to 'MMMM yyyy' */}
      </Text>

      {/* Calendar Grid */}
      <View style={{ height: 300 }} className="mb-6">
        <View className="flex-row justify-between mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
            <Text key={i} className="flex-1 text-center font-semibold">{d}</Text>
          ))}
        </View>

        <View className="flex-1">
          {calendarWeeks.map((week, weekIndex) => (
            <View key={weekIndex} className="flex-row flex-1">
              {week.map((date, dayIndex) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const isCurrentMonthDay = date && isSameMonth(date, new Date());
                const isFutureOrToday = date && !isPast(date, today);
                const isAvailable = date && isAvailableDay(date);
                const isSelectable = isFutureOrToday && isAvailable;
                const isSelected = date && selectedDate && isSameDay(date, selectedDate);

                return (
                  <TouchableOpacity
                    key={`${weekIndex}-${dayIndex}`}
                    disabled={!date || !isSelectable}
                    onPress={() => setSelectedDate(date)}
                    className="flex-1 h-10 justify-center items-center rounded-full m-0.5"
                    style={{
                      backgroundColor: isSelected
                        ? "#06b6d4"
                        : isSelectable
                          ? "#e0f7fa"
                          : "#f0f0f0",
                      opacity: (date && (!isCurrentMonthDay || isPast(date, today))) ? 0.4 : 1,
                    }}
                  >
                    <Text
                      className="text-sm"
                      style={{
                        color: isSelected
                          ? "white"
                          : isSelectable
                            ? "#007b83"
                            : "#999",
                      }}
                    >
                      {date ? format(date, "d") : ""}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
      {selectedDate && (
        <>
          <Text className="text-lg font-semibold mb-2">Available Time Slots</Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {doctor?.availableTimeSlots?.map((slot, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setSelectedSlot(slot)}
                className={`px-4 py-2 rounded-full ${
                  selectedSlot === slot ? "bg-cyan-500" : "bg-gray-200"
                }`}
              >
                <Text className={`${selectedSlot === slot ? "text-white" : "text-black"} font-medium`}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}
      <View className="mb-4">
        <Text className="text-lg font-semibold mb-2">Select Symptom</Text>
        <View className="flex-row flex-wrap gap-2">
          {symptoms.map((symptom, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedSymptom(symptom)}
              className={`px-4 py-2 rounded-full ${
                selectedSymptom === symptom ? "bg-cyan-500" : "bg-gray-200"
              }`}
            >
              <Text className={selectedSymptom === symptom ? "text-white" : "text-black"}>
                {symptom}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View className="mb-6">
        <Text className="text-lg font-semibold mb-2">Additional Notes</Text>
        <TextInput
          className="border border-gray-300 rounded-lg p-3 bg-gray-50"
          placeholder="Add any additional notes..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={notes}
          onChangeText={setNotes}
        />
      </View>
      <TouchableOpacity
        onPress={handleBookAppointment}
        className={`py-4 rounded-xl mb-6 ${
          selectedDate && selectedSlot && reason && selectedSymptom
            ? "bg-cyan-500"
            : "bg-gray-400"
        }`}
        disabled={!selectedDate || !selectedSlot || !reason || !selectedSymptom}
      >
        <Text className="text-white text-center font-bold">
          Set Appointment
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
