import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import GlobalProvider from '../context/GlobalProvider';
import { useEffect } from 'react';


SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const colorScheme = useColorScheme();
  const [fontsLoaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if(error) throw error;

    if(fontsLoaded) SplashScreen.hideAsync()
  },[fontsLoaded, error])


  if(!fontsLoaded && !error){
    return null;
  }

  return (
    <GlobalProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name='(auth)' options={{headerShown:false}}/>
          <Stack.Screen name='my-appointments/[appointmentId]' options={{headerShown:false}}/>
        </Stack>
        <StatusBar style="auto" />
    </GlobalProvider>
  );
}
