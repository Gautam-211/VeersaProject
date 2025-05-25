import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GlobalContext = createContext();
export const useGlobalContext = () => {
  return useContext(GlobalContext);
}
const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
<<<<<<< HEAD
  const [recentAppointment, setRecentAppointment] = useState(null); 
=======
  const [recommendation, setRecommendation] = useState(null);
>>>>>>> 5c59d3cc3612d3b1bfa828b815538349c80884ce

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.log("Auto-login error", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isLoading,
        appointments,
        setAppointments,
<<<<<<< HEAD
        recentAppointment,
        setRecentAppointment, 
      }}
    >
=======
        recommendation,
        setRecommendation
     }}>
>>>>>>> 5c59d3cc3612d3b1bfa828b815538349c80884ce
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;