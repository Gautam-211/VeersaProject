import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL = 'https://veersa-backend.onrender.com';

export const signInUser = async (email, password) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Invalid email or password');
    }

    // Optionally persist user
    await AsyncStorage.setItem('user', JSON.stringify(data));

    return data; // return user data on success
  } catch (error) {
    throw error; // Let caller handle the error
  }
};


export const signUpUser = async ({ name, email, password, phone, address }) => {
  try {
    const response = await fetch(`${BASE_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, phone, address }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

