import React, { useEffect } from 'react';
import { View, Image, StyleSheet, ImageBackground } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function SecCustomScreen() {
  useEffect(() => {
    async function prepare() {
      try {
        // Simulate some loading time
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide the splash screen
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  return (
    <ImageBackground
      source={require('../assets/images/ss2.jpg')} // Replace with your background image
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Image style={styles.logo} source={require('../assets/images/zerologo-white.png')} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(52, 150, 213, 0.9)', // If you want an overlay
  },
  logo: {
    width: 180, // Adjust the logo size as needed
    height: 180,
    resizeMode: 'contain',
  },
});
