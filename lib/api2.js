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
 console.log(email);
 console.log(password)
    const data = await response.json();
    console.log(data);

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

export const getAppointmentsByUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/appointments/user/${userId}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch appointments');
    }

    return data; // Should return an array of appointments
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

export const getAppointmentByAppointmentId = async (appointmentId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/appointments/${appointmentId}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch appointment');
    }

    return data; // Should return the appointment details
  } catch (error) {
    console.error('Error fetching appointment:', error);
    throw error;
  }
}

export const getSymptomsList = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/symptoms/list`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch symptoms list');
    }


    return data.symptoms; // Should return the appointment details
  } catch (error) {
    console.error('Error fetching symptoms list :', error);
    throw error;
  }
}

export const analyzeSymptoms = async (payload) => {
  try {
    const response = await fetch(`${BASE_URL}/api/symptoms/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to analyze symptoms');
    }

    return data; // You can shape the return based on what the backend sends
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    throw error;
  }
};

