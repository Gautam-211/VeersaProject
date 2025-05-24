import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, 
  Alert, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform 
} from 'react-native';
import { getSymptomsList, analyzeDiagnosis } from '../../lib/api2'; // Implement analyzeDiagnosis API call
import { router } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';

export default function DiagnosisFormScreen() {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const {setDiagnosis} = useGlobalContext(); 
  // Patient info state
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  // Lifestyle state
  const [smoking, setSmoking] = useState(false);
  const [alcohol, setAlcohol] = useState('');
  const [exercise, setExercise] = useState('');
  const [diet, setDiet] = useState('');
  // Others
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

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
        [symptomName]: 'moderate', // Default
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
    setSubmitLoading(true);
    try {
      // Build data to match your example structure
      const payload = {
        symptoms: Object.keys(selectedSymptoms),
        patientInfo: {
          age: Number(age),
          gender,
          height: Number(height),
          weight: Number(weight),
          medicalHistory: medicalHistory
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0),
          currentMedications: currentMedications
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0),
          allergies: allergies
            .split(',')
            .map((item) => item.trim())
            .filter((item) => item.length > 0),
          lifestyle: {
            smoking,
            alcohol,
            exercise,
            diet,
          },
        },
        lang: 'en',
      };

      const result = await analyzeDiagnosis(payload); // Send to backend
      setDiagnosis(result); // Assuming you have a context to set diagnosis

      Alert.alert("Diagnosis Complete", "See your results!", [
        {
          text: "OK",
          onPress: () => router.push('/ai-help/diagnosis'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error.message || 'Could not analyze diagnosis');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // UI Rendering
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
            AI Diagnosis
          </Text>
          <ScrollView
            className="flex-1 px-4 py-6 bg-white"
            contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >

            {/* SYMPTOM SELECTOR */}
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

            {/* PATIENT INFO FIELDS */}
            <Text className="text-lg font-semibold mt-6 mb-2">Patient Info</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
              placeholder="Age"
              keyboardType="numeric"
              value={age}
              onChangeText={setAge}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
              placeholder="Gender (e.g., male, female)"
              value={gender}
              onChangeText={setGender}
            />
            <View className="flex-row gap-2">
              <TextInput
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mb-2"
                placeholder="Height (cm)"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
              <TextInput
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mb-2"
                placeholder="Weight (kg)"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
              placeholder="Medical History (comma-separated)"
              value={medicalHistory}
              onChangeText={setMedicalHistory}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
              placeholder="Current Medications (comma-separated)"
              value={currentMedications}
              onChangeText={setCurrentMedications}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
              placeholder="Allergies (comma-separated)"
              value={allergies}
              onChangeText={setAllergies}
            />

            {/* LIFESTYLE FIELDS */}
            <Text className="text-lg font-semibold mt-6 mb-2">Lifestyle</Text>
            <View className="flex-row items-center gap-3 mb-2">
              <TouchableOpacity
                onPress={() => setSmoking((s) => !s)}
                className={`px-3 py-2 rounded-full border ${
                  smoking ? 'bg-red-500 border-red-600' : 'bg-gray-100 border-gray-300'
                }`}
              >
                <Text className={`text-sm ${smoking ? 'text-white' : 'text-black'}`}>
                  {smoking ? 'Smoking' : "Non-Smoking"}
                </Text>
              </TouchableOpacity>
            </View>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
              placeholder="Alcohol (e.g., never, occasional)"
              value={alcohol}
              onChangeText={setAlcohol}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 mb-2"
              placeholder="Exercise (e.g., none, moderate, intense)"
              value={exercise}
              onChangeText={setExercise}
            />
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2 mb-4"
              placeholder="Diet (e.g., balanced, vegetarian)"
              value={diet}
              onChangeText={setDiet}
            />
          </ScrollView>
          {/* Submit Button */}
          <View className="px-4 pb-5 bg-white">
            <TouchableOpacity
              onPress={handleSubmit}
              className={`bg-teal-400 py-3 rounded-lg ${submitLoading ? 'opacity-60' : ''}`}
              disabled={submitLoading}
            >
              {submitLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-white text-center font-semibold">
                  Submit for Diagnosis
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}