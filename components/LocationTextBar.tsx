import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import * as Location from 'expo-location';
import { FontAwesome } from '@expo/vector-icons'; // Icon library

export default function LocationTextBar() {
  const [location, setLocation] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permission to access location was denied');
        return;
      }
  
      let { coords } = await Location.getCurrentPositionAsync({});
      let response = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
  
      for (let item of response) {
        let address = `${item.name},  ${item.city}, ${item.region}`;
        setLocation(address);
      }
    } catch (error) {
      Alert.alert(
        "Location Access Required",

"To enhance your experience, we require access to your device's location.",
        [
          {
            text: "Cancel",
            onPress: () => null,
            //console.log("Permission Denied"),
            style: "cancel",
          },
          { 
            text: "Open Settings", 
            onPress: () => Linking.openSettings() 
          },
        ],
        { cancelable: false }
      );
    }
   
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.locationWrapper}>
        <Text style={styles.text}>Location: {location || 'Fetching...'}</Text>
        <FontAwesome name="map-marker" size={20} color="red" style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 20,
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
  icon: {
    marginLeft: 10,
  },
});
