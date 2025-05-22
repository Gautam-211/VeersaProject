import axios from 'axios';

export const getAllDoctors = async () => {
  try {
    const response = await axios.get('https://veersa-backend.onrender.com/api/doctors');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    throw error;
  }
};
