import axios from 'axios';
export const BASE_URL = 'https://veersa-backend.onrender.com';
export const getAllDoctors = async (page = 1, limit = 15) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/doctors`, {
      params: { page, limit },
    });
    // console.log(response);
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
export const getAllDoctorsBySpecialization = async (specialization,limit = 50) => {
  try{
 const response = await axios.get(`${BASE_URL}/api/doctors`, {
    params: { specialization,
      limit

     }
  });
  return response.data.doctors;
  }
  catch(err){
    console.error('Failed to fetch doctors:', error);
    throw err;
  }
 
};

