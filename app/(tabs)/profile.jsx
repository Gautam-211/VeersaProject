import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Linking } from 'react-native';
import { useGlobalContext } from "../../context/GlobalProvider"; // adjust path if needed
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const ProfileScreen = () => {
  const { user, setIsLoggedIn, setUser } = useGlobalContext();

  const items = [
    { icon: 'time-outline', label: 'History' },
    { icon: 'person-outline', label: 'Personal Details' },
    { icon: 'location-outline', label: 'Location' },
    { icon: 'card-outline', label: 'Payment Method' },
    { icon: 'settings-outline', label: 'Settings' },
    // { icon: 'help-circle-outline', label: 'Help' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white pt-32">
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text className="text-3xl font-semibold text-center mt-4 mb-6">Profile</Text>

        <Text className="text-center font-bold text-xl mb-6">
          {user?.name || 'No Name'}
        </Text>

        {items.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            className="flex-row items-center p-4 border-b border-gray-200"
          >
            <Ionicons name={item.icon} size={22} color="#00BFFF" />
            <Text className="ml-4 text-base text-gray-800">{item.label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
            className="flex-row items-center p-4 border-b border-gray-200"
            onPress={() => {
                setIsLoggedIn(false);
                setUser(null);
                AsyncStorage.removeItem('user');
                router.replace('/sign-in');
            }}
          >
            <Ionicons name={"log-out-outline"} size={22} color="#00BFFF" />
            <Text className="ml-4 text-base text-gray-800">{"Logout"}</Text>
        </TouchableOpacity>

        <View className="mt-6 p-4 bg-gray-100 rounded-lg">
          <Text className="font-semibold">Email:</Text>
          <Text className="mb-2">{user?.email}</Text>

          <Text className="font-semibold">Phone:</Text>
          <Text className="mb-2">{user?.phone || 'Not Provided'}</Text>

          <Text className="font-semibold">Address:</Text>
          <Text>{user?.address || 'Not Provided'}</Text>
          {/* <TouchableOpacity onPress={() => Linking.openURL("https://www.google.com/maps/dir/?api=1&origin=28.6295,77.0946&destination=28.6304,77.2177&travelmode=driving")}>
            <Text className="text-blue-500 mt-2">click here</Text>
          </TouchableOpacity> */}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
