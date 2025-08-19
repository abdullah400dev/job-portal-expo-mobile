import React, { useState, useEffect, useContext } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Button,
  Alert,
} from "react-native";
import SwipeableCard from "@/components/JobCard";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import  Constants  from "expo-constants";
import { UserContext } from "../UserContext";
const { width, height } = Dimensions.get("window");

type Card = {
  id: any;
  jobTitle: string;
  location: string;
  description: string;
  imageUrl: string;
  name: string;
  image: string;
  userId: string;
  userName: string;
  jobId: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string>();
  const [refetch,setRefetch] = useState<boolean>(false);
  const apiBaseUrl = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;
  const { user, setUser } = useContext(UserContext);

  const fetchData = async () => {
    setLoading(true); // Show loading indicator
    setRefetch(false)
    try {
      const response = await fetch(`${apiBaseUrl}/api/get-jobs`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Ensure data is in the correct format before using .map()
      if (!Array.isArray(data)) {
        throw new Error("Data format error: Expected an array.");
      }

      // console.log("data of api call", data);
      // console.log("Total number of jobs:", data.length);

      // Map the jobs to the card structure
      const formattedCards: any = data.map((job) => ({
        id: job._id,
        jobTitle: job.jobTitle,
        location: job.location,
        description: job.description,
        imageUrl: job.imageUrl,
        name: job.user !== null ? job.user.userName : "User Deleted" ,
        image: job.imageUrl,
        userId: job.user !== null ? job.user._id : "12345",
        jobId: job._id,
      }));

      setCards(formattedCards); // Update state with new cards
      // console.log("Formatted Cards (after setting state):", formattedCards);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchData();
    printSwipedData();
  }, []);

  const printSwipedData = async () => {
    try {
      // const storedData = await AsyncStorage.getItem("reciveID");
      const storedData = await AsyncStorage.getItem("user");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // setUserId(parsedData.user._id);
        // console.log(
        //   "Retrieved swiped card data from AsyncStorage:",
        //   parsedData
        // );
      } else {
        // console.log("No swiped card data found in AsyncStorage.");
      }
    } catch (error) {
      console.error("Failed to retrieve swiped card data:", error);
    }
  };

  const handleSwipe = async (jobId: string) => {
    try {
      const swipedCard = cards.find((card) => card.id === jobId);
      if (swipedCard) {
        const dataToSave = {
          jobId: swipedCard.jobId,
          userId: user.id || user.userId,
        };

        await AsyncStorage.setItem("reciveID", JSON.stringify(dataToSave));
        console.log("Saved swiped card data to AsyncStorage:", dataToSave);
        await printSwipedData();
        setCards((prevCards) => prevCards.filter((card) => card.id !== jobId));

        try {
          setLoading(true);

          const response = await axios.post(
            `${apiBaseUrl}/api/applied-user`,
            dataToSave,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          if (response.status === 200) {
            
              console.log("API response:", response.data);
              setLoading(false);

              // Alert.alert("Applied Successfully........");
        
          } else {
            console.error("Failed to call API:", response.statusText);
          }
        } catch (error) {
          console.error("Error while calling API:", error);
        }
      }
    } catch (error) {
      console.error("Error handling swipe:", error);
    }
  };

  // if (loading) {
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

  const handleCount = (count: any) => {
    if(count < 1) {
      setTimeout(() => {
        setRefetch(true)
      }, 148.257);
    }
  };
  
  return (
    <GestureHandlerRootView style={styles.container}>
      {refetch ? (
        // <View style={styles.buttonWrapper}>
        //   <Button title="Refetch Jobs" onPress={fetchData} />
        // </View>
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Text style={{fontSize: 30}}>No Job Found</Text>
        </View>
      ) : (
        <View style={styles.cardsWrapper}>
          {cards.map((card, index) => (
            <SwipeableCard
              key={card.id}
              cardData={card}
              onSwipe={() => handleSwipe(card.id)}
              index={index}
              totalCards={cards.length}
              incrementCount={() => handleCount(index)}
            />
          ))}
        </View>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
  },
  cardsWrapper: {
    flex: 1,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
