import React, { useEffect, useState, useCallback } from 'react';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useFonts } from 'expo-font';
import {jwtDecode} from 'jwt-decode';
import * as SplashScreen from 'expo-splash-screen';
import CustomScreen from './CustomSplashScreen';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Text, View } from 'react-native';
import { UserProvider } from '../app/UserContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const loadResourcesAndDataAsync = async () => {
      try {
        // Simulate loading resources and checking authentication
        await new Promise((resolve) => setTimeout(resolve, 4000)); // 4-second delay

        const token = await SecureStore.getItemAsync('token');
        if (token) {
          const decodedToken: { exp: number } = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp > currentTime) {
            setIsAuthenticated(true);
          } else {
            // console.log('Token expired. Redirecting to login...');
            setIsAuthenticated(false);
            await SecureStore.deleteItemAsync('token');
          }
        } else {
          setIsAuthenticated(false);
        }

        if (fontsLoaded) {
          setIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    };

    loadResourcesAndDataAsync();
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (isReady) {
      await SplashScreen.hideAsync();
    }
  }, [isReady]);

  // if (!isReady) {
  //   return <CustomScreen />;
  // }

  if(!isReady) {
    return null;
  }

  return (
    <UserProvider>

    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {isAuthenticated ? (
            <>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

            <Stack.Screen name="(employer)" options={{ headerShown: true }} />
            </>
          ) : (
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          )}
          <Stack.Screen name="+not-found" />
        </Stack>
      {/* </ThemeProvider> */}
    </View>
    </UserProvider>

  );
}
