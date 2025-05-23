import axios from 'axios';

export const getAllDoctors = async () => {
  try {
    const response = await axios.get('https://veersa-backend.onrender.com/api/doctors');
    console.log(response);
    if (!response.data) {
      throw new Error('No data received from API');
    }
    return response.data.doctors;
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    throw error;
  }
};

