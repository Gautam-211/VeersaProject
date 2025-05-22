import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import {useGlobalContext} from '../../context/GlobalProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const[loading, setIsLoading] = useState(false);

  const { setUser, setIsLoggedIn, user } = useGlobalContext();
    const router = useRouter();

const handleSignIn = async () => {
  setIsLoading(true);
  try {
    const response = await fetch('https://veersa-backend.onrender.com/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Update context
      setUser(data);
      setIsLoggedIn(true);


      // Persist token or user if needed
      await AsyncStorage.setItem('user', JSON.stringify(data));

      // TODO :
      // Navigate to dashboard/home page
      // router.replace('/home'); // replace '/home' with your protected screen route
    } else {
      alert(data.message || 'Invalid email or password');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Something went wrong. Please try again.');
  }
  finally {
    setIsLoading(false);
  }
};


  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-32">
        {/* Header */}
        <View className="items-center mb-10">
          <Text className="text-2xl font-semibold text-teal-400 mb-2">Welcome</Text>
          <Text className="text-3xl font-bold text-black mb-2">Sign In</Text>
        </View>

        {/* Form */}
        <View className="mb-8">
          {/* Email Input */}
          <View className="mb-5">
            <Text className="text-base font-semibold text-black mb-2">Email</Text>
            <TextInput
              className="h-12 border border-gray-200 rounded-lg px-4 text-base bg-gray-100"
              placeholder="Enter Your Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View className="mb-5">
            <Text className="text-base font-semibold text-black mb-2">Password</Text>
            <View className="flex-row items-center border border-gray-200 rounded-lg bg-gray-100">
              <TextInput
                className="flex-1 h-12 px-4 text-base"
                placeholder="Enter Your Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                className="px-4"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={20}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity
          className={`${loading ? "opacity-40" : "opacity-100"} bg-teal-400 h-12 rounded-lg justify-center items-center mb-8`}
          onPress={handleSignIn}
          disabled={loading}
        >
          <Text className="text-base font-semibold text-white">Sign In</Text>
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="flex-row justify-center items-center">
          <Text className="text-sm text-gray-500">Don&apos;t have an account? </Text>
          <Link href="/sign-up" className="text-sm text-teal-400 font-semibold">Sign Up</Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
