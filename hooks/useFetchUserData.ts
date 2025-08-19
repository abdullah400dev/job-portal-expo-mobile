import { useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '@/app/UserContext'; // Adjust the path as needed
import Constants  from 'expo-constants';

const useFetchUserData = () => {
  const { setUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiBaseUrl = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          throw new Error('No token found');
        }

        const userResponse = await fetch(`${apiBaseUrl}/api/all-users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Send token in the Authorization header
          },
        });

        const responseJson = await userResponse.json();

        if (userResponse.ok) {
          const userData = responseJson.user; // Access the nested user data
          // Save the fetched user data to state and AsyncStorage
          await AsyncStorage.setItem('user', JSON.stringify(userData));
          setUser(userData); // Update the UserContext with the fetched data
        } else {
          throw new Error(responseJson.error || 'Failed to fetch user data');
        }
      } catch (err:any) {
        console.error('Failed to fetch user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setUser]);

  return { loading, error };
};

export default useFetchUserData;
