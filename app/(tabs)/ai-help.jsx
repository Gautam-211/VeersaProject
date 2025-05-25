import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useGlobalContext } from "../../context/GlobalProvider";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const AIHelpScreen = () => {
  const { user } = useGlobalContext();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 0 }}>
        {/* Header Card */}
        <View className="bg-teal-400 pt-11 pb-6 px-6 rounded-b-3xl items-start">
          <Text className="text-white text-2xl font-bold mb-1">Welcome Back,</Text>
          <Text className="text-teal-100 text-lg font-semibold">
            {user?.name || 'No Name'}
          </Text>
        </View>

        <Text className="text-xl font-bold text-center mt-7 mb-8 text-teal-400">
          How can AI help you today?
        </Text>

        {/* Menu Card */}
        <TouchableOpacity
            className="mx-4 mb-4 rounded-xl flex-row items-center bg-teal-50 py-6 px-4 shadow-lg shadow-teal-400/10"
            activeOpacity={0.85}
            onPress={() => router.push('/ai-help/recommendation-form')}
        >
        <View className="bg-teal-400 p-3 rounded-full mr-5">
            <Ionicons name="school-outline" size={28} color="#fff" />
        </View>
        <Text className="text-lg font-bold text-slate-800 flex-1 flex-shrink">
            Get Specialization Recommendation
        </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AIHelpScreen;