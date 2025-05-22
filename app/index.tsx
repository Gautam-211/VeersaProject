import { View, Text, ScrollView, Image } from 'react-native';
import "./global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Redirect, router } from 'expo-router';
import 'react-native-url-polyfill/auto'
import { useGlobalContext } from '../context/GlobalProvider';

export default function App() {

    const {isLoading, isLoggedIn} = useGlobalContext();
    
    if(!isLoading && isLoggedIn){
        // return <Redirect href="/home"/>
    }

  return (
    <Redirect href="./sign-in"/>
  );
}
