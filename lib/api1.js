import axios from 'axios';
export const BASE_URL = 'https://veersa-backend.onrender.com';
export const getAllDoctors = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/doctors`);
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

export const doctorProfile=async(doctorId)=>{
  try{
       const response = await axios.get(`${BASE_URL}/api/doctors/${doctorId}`);
       return response.data;
  }catch(err){
    console.error("Error fetching doctor data:", err);
  }

}

