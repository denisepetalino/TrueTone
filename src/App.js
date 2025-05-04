import React, { useEffect, useState} from 'react';
import * as Font from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {View, ActivityIndicator} from 'react-native';

import AnalyseMeScreen from './screens/AnalyseMeScreen';
import QuizScreen from './screens/QuizScreen';
import UploadScreen from './screens/UploadScreen';
import WardrobeScreen from './screens/WardrobeScreen';
import ProfileScreen from './screens/ProfileScreen';
import NearbyCharitiesScreen from './screens/NearbyCharities';

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    Font.loadAsync({
      'HammersmithOne': require('./assets/fonts/HammersmithOne-Regular.ttf'),
      'Quicksand-Light': require('./assets/fonts/Quicksand-Light.ttf'),
      'Quicksand-Regular': require('./assets/fonts/Quicksand-Regular.ttf'),
      'Quicksand-SemiBold': require('./assets/fonts/Quicksand-SemiBold.ttf'),
    }).then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#DB7C87" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 300,
      }}
      >
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Upload" component={UploadScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Wardrobe" component={WardrobeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AnalyseMe" component={AnalyseMeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NearbyCharities" component={NearbyCharitiesScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}