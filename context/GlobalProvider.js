import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

const GlobalContext = createContext();

export const useGlobalContext = () => {
  return useContext(GlobalContext);
}

const GlobalProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//   const loadUser = async () => {
//     try {
//       const storedUser = await AsyncStorage.getItem('user');
//       if (storedUser) {
//         setUser(JSON.parse(storedUser));
//         setIsLoggedIn(true);
//       }
//     } catch (err) {
//       console.log("Auto-login error", err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   loadUser();
// }, []);

  return (
    <GlobalContext.Provider value={{ 
        isLoggedIn, 
        setIsLoggedIn,
        user,
        setUser,
        isLoading
     }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;