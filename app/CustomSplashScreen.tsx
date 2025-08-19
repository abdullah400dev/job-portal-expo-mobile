import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { LinearGradient } from 'expo-linear-gradient';

SplashScreen.preventAutoHideAsync();

export default function CustomScreen() {
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
    <LinearGradient
      colors={['hsla(202, 85%, 66%, 1)', 'hsla(206, 67%, 46%, 1)']}
      start={[0, 0]}
      end={[1, 0]}
      style={styles.container}
    >
      <Image style={styles.image} source={require('../assets/images/zerologo-white.png')} />
      <Image style={styles.image} source={require('../assets/images/zero-white.png')} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  image: {
    width: 165, // adjust as needed
    height: 165, // adjust as needed
    resizeMode: 'contain',
  },
});
