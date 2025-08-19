import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    userId: '',
    userName: '',
    email: '',
    imageUrl: '',
    description: '',
    employer: '',
    phoneNumber: '',
    location: ''
  });

  const [receiverId, setReceiverId] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('user');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, []);

  const clearUserData = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('swipedCardIds');
    setUser({
      userId: '',
      userName: '',
      email: '',
      imageUrl: '',
      description: '',
      employer:'',
      phoneNumber: '',
      location: ''
    });
    setReceiverId(null); // Reset receiverId when user data is cleared
  };

  const storeUserData = async (userData) => {
    const user = {
      userId: userData.user._id, // Storing the user ID
      userName: userData.user.userName,
      email: userData.user.email,
      imageUrl: userData.user.imageUrl,
      description: userData.user.description,
      phoneNumber: userData.user.phoneNumber,
      employer: userData.user.employer,
      location: userData.user.location
    };
    await AsyncStorage.setItem('user', JSON.stringify(user));
    setUser(user);
  };

  const saveSwipedCardId = async (cardId, cardUserId) => {
    try {
      const storedData = await AsyncStorage.getItem('swipedCardData');
      let data = storedData ? JSON.parse(storedData) : [];
      
      // Add the new card data to the array
      data.push({ cardId, cardUserId });
      
      // Save the updated array back to AsyncStorage
      await AsyncStorage.setItem('swipedCardData', JSON.stringify(data));
      
      // Update the receiverId state with the latest cardId
      setReceiverId(cardId); // Assuming setReceiverId is defined in your component
    } catch (error) {
      console.error("Failed to store swiped card data:", error);
    }
  };
  
  const getSwipedCardIds = async () => {
    try {
      const storedData = await AsyncStorage.getItem('swipedCardData');
      if (storedData) {
        return JSON.parse(storedData); // Returns an array of objects [{cardId, cardUserId}, ...]
      } else {
        return [];
      }
    } catch (error) {
      console.error("Failed to retrieve swiped card data:", error);
      return [];
    }
  };
  
  

  return (
    <UserContext.Provider value={{ user, setUser, clearUserData, storeUserData, saveSwipedCardId, getSwipedCardIds, receiverId }}>
      {children}
    </UserContext.Provider>
  );
};
