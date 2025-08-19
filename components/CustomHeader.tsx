import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Define the props type
interface CustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require('../assets/images/back-icon.png')}
          style={{ width: 25, height: 25, marginLeft: 20, objectFit: 'contain' }}
        />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingBottom: 20,
    shadowColor: Platform.select({
      ios: "#32D6D81A", // Reduce opacity for iOS
      android: "rgba(50, 214, 216, 1)", // Keep as it is for Android
    }),
    shadowOffset: Platform.select({
      ios: { width: 0, height: 5 }, // Lower height offset for iOS
      android: { width: 0, height: 10 }, // Use the desired height for Android
    }), // Reduce the offset for iOS
    shadowOpacity: Platform.select({
      ios: 0.9, // Lower the opacity for iOS
      android: 1, // Keep full opacity for Android
    }),
    shadowRadius: Platform.select({
      ios: 4, // Reduce the blur radius for iOS
      android: 4, // Keep it the same for Android
    }),
    elevation: 10,
  },
  headerTitle: {
    fontSize: 24,
    color: '#434B50',
    fontWeight: 'bold',
    flex: 1, // This centers the title
    textAlign: 'center', // Ensure text is centered
    marginRight: 35, // Offset to balance the title due to back button
  },
});

export default CustomHeader;
