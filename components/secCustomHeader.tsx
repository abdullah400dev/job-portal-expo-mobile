import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements'; // For the menu icon
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Define the props type
interface SecCustomHeaderProps {
  title: string;
}

const CustomHeader: React.FC<SecCustomHeaderProps> = ({ title }) => {
  const navigation = useNavigation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoutLoader, setLogoutLoader] = useState(false);
  const [loading, setLoading] = useState(true); // Loader state for data loading
  const router = useRouter();

  


  const handleLogout = async () => {
    try {
      setLogoutLoader(true);
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("authToken");
        setLogoutLoader(false);
        router.push("/(auth)/");
    } catch (error) {
      // console.log("Error: ", error)
    }
  }
  return (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={['hsla(202, 85%, 66%, 1)', 'hsla(206, 67%, 46%, 1)']}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.container}
      >
        <View style={styles.wrapper}>
          {/* Title in the center */}
          <Text style={styles.headerTitle}>{title}</Text>

          {/* Menu button on the right */}
          <TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)}>
            <Icon name="menu" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Menu dropdown */}
        {isMenuOpen && (
          <View style={styles.menu}>
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                style={styles.updateButton}
                onPress={handleLogout}
                disabled={logoutLoader}
              >
                {logoutLoader ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Logout</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 120,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 35, // Adjusted to center the title properly
  },
  menu: {
    backgroundColor: '#fff',
    padding: 10,
    position: 'absolute',
    right: 20,
    top: 90,
    borderRadius: 5,
    elevation: 5, // For Android shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2, // For iOS shadow
  },
  updateButton: {
    backgroundColor: '#4BB2EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomHeader;
