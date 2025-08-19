import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Dimensions,
    Image,
  } from "react-native";
  import React, { useContext, useState } from "react";
  import { UserContext } from "../UserContext";
  import { useFocusEffect, useRouter } from "expo-router";
  import  Constants  from "expo-constants";
  // Define the type for a contact
  type Contact = {
    _id: string;
    userName: string;
    email: string;
    imageUrl: string;

  };
  const { width, height } = Dimensions.get("window");

  export default function AllMessages() {
    const router = useRouter();
    const { user } = useContext(UserContext); // Get the logged-in user's info from UserContext
    const [contacts, setContacts] = useState<Contact[]>([]); // State to store the list of users
    const [loading, setLoading] = useState<boolean>(true); // State to manage loading
    const apiBaseUrl = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;
    useFocusEffect(
      React.useCallback(() => {
        const fetchContacts = async () => {
          setLoading(true); // Start loading
          try {
            const response = await fetch(
              `${apiBaseUrl}/api/user-messages?userId=${user.userId || user._id}`
            );
            const data = await response.json();
            console.log("Data:", data.messages);
  
            if (response.ok && data && Array.isArray(data.messages)) {
              // Extract unique contacts from messages
              // console.log("Data:", data);
              const uniqueContactsMap = new Map();
  
              data.messages.forEach((message:any) => {
                const sender = message.senderId;
                const receiver = message.receiverId;
  
                // Add the sender as a contact if it's not the current user
                if (sender && sender._id !== user.userId && sender._id !== user._id) {
                  uniqueContactsMap.set(sender._id, sender);
                }
  
                // Add the receiver as a contact if it's not the current user
                if (receiver && receiver._id !== user.userId && receiver._id !== user._id) {
                  uniqueContactsMap.set(receiver._id, receiver);
                }
              });
  
              // Convert map values to an array and set contacts
              setContacts(Array.from(uniqueContactsMap.values()));
            } else {
              console.error("Failed to fetch contacts: Unexpected response structure.");
            }
          } catch (error) {
            console.error("Error fetching contacts:", error);
          } finally {
            setLoading(false); // Stop loading after fetching is complete
          }
        };
  
        fetchContacts();
      }, [user.userId, user._id]) // Dependency array to ensure user ID changes are respected
    );
  
    // Function to handle the click event
    const handleContactPress = (contactId: string, userName: string) => {
      router.push({
        pathname: "/(otherScreens)/specific-user-messages",
        params: { contactId, userName},
      });
    };
  
    return (
      <View style={styles.container}>
        {loading ? ( // Show loader while loading
          <ActivityIndicator size="large" color="#1F93D6" style={styles.loader} />
        ) : contacts.length > 0 ? (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {contacts.map((contact) => (
              <TouchableOpacity
                key={contact._id}
                style={styles.msgContainer}
                onPress={() => handleContactPress(contact._id, contact.userName || contact.email)} // Set up the click handler
              >
                <Text style={styles.msgUser}>{contact.userName || contact.email }</Text>
                <Image source={{ uri: contact.imageUrl }} style={{backgroundColor: "#eee", width: 50, height: 50, borderRadius: 25}}/>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noContactsText}>No contacts found.</Text>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: 20,
      backgroundColor: "#F5F5F5",
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: "flex-start",
      alignItems: "center",
    },
    msgContainer: {
      width: width * 0.8,
      height: 100,
      borderRadius: 10,
      marginVertical: 10,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#eee",
      elevation: 5,
      marginBottom: 10,
    },
    msgUser: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    noContactsText: {
      fontSize: 18,
      color: "#888",
      textAlign: "center",
      marginTop: 20,
    },
    loader: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
  