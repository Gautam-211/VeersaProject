import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState(''); // Added address state
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);
  try {
    const response = await fetch('https://veersa-backend.onrender.com/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: fullName,
        email: email,
        password: password,
        phone: mobileNumber,
        address: address,
      }),
    });

    const data = await response.json();

    if (response.ok) {
    //   console.log('Signup successful:', data);
      // You can navigate to another screen or store the token here
      alert('Signup successful!');
      router.replace('/sign-in'); // Redirect to sign-in page after successful signup
    } else {
      console.error('Signup failed:', data);
      alert(data.message || 'Signup failed. Please try again.');
    }
  } catch (error) {
    console.error('Error during signup:', error);
    alert('An error occurred. Please try again later.');
  }
  finally {
    setIsLoading(false);
  }
};


  return (
    <SafeAreaView className="flex-1 bg-white">
        <ScrollView>
      <View className="flex-1 px-6 pt-16">
        {/* Header */}
        <View className="items-center mb-10">
          <Text className="text-2xl font-semibold text-teal-400 text-center">
            Create New Account
          </Text>
        </View>

        {/* Form */}
        <View className="mb-8">
          {/* Full Name Input */}
          <View className="mb-5">
            <Text className="text-base font-semibold text-black mb-2">
              Full Name
            </Text>
            <TextInput
              className="h-12 border border-[#E5E5E5] rounded-lg px-4 text-base bg-[#F9F9F9]"
              placeholder="Enter Your Full Name"
              placeholderTextColor="#999"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>

          {/* Password Input */}
          <View className="mb-5">
            <Text className="text-base font-semibold text-black mb-2">
              Password
            </Text>
            <View className="flex-row items-center border border-[#E5E5E5] rounded-lg bg-[#F9F9F9]">
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
                  color="#2DD4BF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Email Input */}
          <View className="mb-5">
            <Text className="text-base font-semibold text-black mb-2">
              Email
            </Text>
            <TextInput
              className="h-12 border border-[#E5E5E5] rounded-lg px-4 text-base bg-[#F9F9F9]"
              placeholder="Enter Your Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Mobile Number Input */}
          <View className="mb-5">
            <Text className="text-base font-semibold text-black mb-2">
              Mobile Number
            </Text>
            <TextInput
              className="h-12 border border-[#E5E5E5] rounded-lg px-4 text-base bg-[#F9F9F9]"
              placeholder="Enter Your Phone Number"
              placeholderTextColor="#999"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
            />
          </View>

          {/* Address Input */}
          <View className="mb-5">
            <Text className="text-base font-semibold text-black mb-2">
              Address
            </Text>
            <TextInput
              className="h-12 border border-[#E5E5E5] rounded-lg px-4 text-base bg-[#F9F9F9]"
              placeholder="Enter Your Address"
              placeholderTextColor="#999"
              value={address}
              onChangeText={setAddress}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          className="bg-teal-400 h-12 rounded-lg justify-center items-center mb-8"
          onPress={handleSignUp}
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.4 : 1 }}
        >
          <Text className="text-base font-semibold text-white">Sign Up</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <View className="flex-row justify-center items-center">
          <Text className="text-sm text-gray-500">Already have an account? </Text>
          <TouchableOpacity>
            <Link href="/sign-in" className="text-sm text-teal-400 font-semibold">
              Login
            </Link>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}
