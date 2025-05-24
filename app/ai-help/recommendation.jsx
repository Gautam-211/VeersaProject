import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { getSymptomsList } from '../../lib/api2'; // Adjust path as needed

export default function SymptomFormScreen() {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [userAge, setUserAge] = useState('');
  const [userGender, setUserGender] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const data = await getSymptomsList();
        setSymptoms(data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch symptoms');
      } finally {
        setLoading(false);
      }
    };
    fetchSymptoms();
  }, []);

  const toggleSymptom = (symptomName) => {
    if (selectedSymptoms[symptomName]) {
      const copy = { ...selectedSymptoms };
      delete copy[symptomName];
      setSelectedSymptoms(copy);
    } else {
      setSelectedSymptoms({
        ...selectedSymptoms,
        [symptomName]: 'moderate', // Default severity
      });
    }
  };

  const changeSeverity = (symptomName, newSeverity) => {
    setSelectedSymptoms({
      ...selectedSymptoms,
      [symptomName]: newSeverity,
    });
  };

  const handleSubmit = async () => {
    const payload = {
      symptoms: Object.entries(selectedSymptoms).map(([name, severity]) => ({
        name,
        severity,
      })),
      userAge: Number(userAge),
      userGender,
      medicalHistory: medicalHistory.split(',').map((item) => item.trim()),
    };

    console.log(payload);
    // Submit logic here
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // KeyboardAvoidingView helps avoid the keyboard covering inputs
  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <View className="flex-1">
          <Text className="text-3xl font-semibold text-center mt-8 mb-6">
            Get Specialization Recommendation
          </Text>

          <ScrollView
            className="flex-1 px-4 py-6 bg-white"
            contentContainerStyle={{ paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text className="text-xl font-bold mb-4">Select Your Symptoms</Text>
            <View className="flex-row flex-wrap gap-2 mb-6">
              {symptoms.map((symptom) => (
                <TouchableOpacity
                  key={symptom}
                  onPress={() => toggleSymptom(symptom)}
                  className={`px-3 py-2 rounded-full border ${
                    selectedSymptoms[symptom]
                      ? 'bg-teal-400 border-teal-500'
                      : 'bg-gray-100 border-gray-300'
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selectedSymptoms[symptom] ? 'text-white' : 'text-black'
                    }`}
                  >
                    {symptom}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {Object.keys(selectedSymptoms).length > 0 && (
              <>
                <Text className="text-lg font-semibold mb-2">
                  Select Severity
                </Text>
                {Object.keys(selectedSymptoms).map((symptom) => (
                  <View key={symptom} className="mb-4">
                    <Text className="mb-1 font-medium">{symptom}</Text>
                    <View className="flex-row gap-2">
                      {['mild', 'moderate', 'severe'].map((level) => {
                        let activeColor = '';
                        if (level === 'mild') activeColor = 'bg-green-500 border-green-500';
                        if (level === 'moderate') activeColor = 'bg-yellow-400 border-yellow-400';
                        if (level === 'severe') activeColor = 'bg-red-500 border-red-500';

                        return (
                          <TouchableOpacity
                            key={level}
                            onPress={() => changeSeverity(symptom, level)}
                            className={`px-3 py-1 rounded-full border ${
                              selectedSymptoms[symptom] === level
                                ? activeColor
                                : 'bg-gray-100 border-gray-300'
                            }`}
                          >
                            <Text
                              className={`text-sm ${
                                selectedSymptoms[symptom] === level ? 'text-white' : 'text-black'
                              }`}
                            >
                              {level}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </>
            )}

            <Text className="text-lg font-semibold mt-6 mb-2">
              Your Details
            </Text>

            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
              placeholder="Age"
              keyboardType="numeric"
              value={userAge}
              onChangeText={setUserAge}
            />

            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
              placeholder="Gender (e.g., male, female)"
              value={userGender}
              onChangeText={setUserGender}
            />

            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 mb-6"
              placeholder="Medical History (comma-separated)"
              value={medicalHistory}
              onChangeText={setMedicalHistory}
            />

            {/* Add a little extra bottom padding to ensure last field isn't covered */}
          </ScrollView>
          {/* Button fixed outside of ScrollView */}
          <View className="px-4 pb-5 bg-white">
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-teal-400 py-3 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">
                Get Recommendation
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}