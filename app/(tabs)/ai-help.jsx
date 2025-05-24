import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useGlobalContext } from "../../context/GlobalProvider"; // adjust path if needed
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const AIHelpScreen = () => {
  const { user} = useGlobalContext();

  const menuItemStyle = "flex-row items-center mb-5";
  const iconContainerStyle = "bg-blue-100 p-3 rounded-full mr-4";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-3xl font-semibold text-center mt-8 mb-6">AI Help</Text>

        <Text className="text-center font-bold text-xl mb-6">
          {user?.name || 'No Name'}
        </Text>

        {/* Menu Item */}
        <TouchableOpacity className={menuItemStyle} onPress={() => router.push('/ai-help/recommendation')}>
          <View className={iconContainerStyle}>
            <Ionicons name="school-outline" size={24} color="#0077B6" />
          </View>
          <Text className="text-lg font-medium">Get Specialization Recommendation</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AIHelpScreen;
