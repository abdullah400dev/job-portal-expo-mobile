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
  import Constants  from "expo-constants";
  // Define the type for a contact
  type User = {
    _id: string;
    userName: string;
    email: string;
    imageUrl: string;
  };
  
  type Contact = {
    _id: string;
    text: string; // The message text
    createdAt: string; // The creation date of the message
    appliedUsers: User; // Change senderId to be of type User
    jobTitle: string;
    receiverId: string | null; // Assuming receiverId can be null
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
          console.log("User ID:", user.userId || user._id);
          try {
            const response = await fetch(
              `https://zero-psi.vercel.app/api/get-applied-user?userId=${user.userId || user._id}`
            );
            const data = await response.json();
            console.log("Data:", data);
            setContacts(data || []);

            // if (response.ok && data && Array.isArray(data.messages)) {
            //   const uniqueContactsMap = new Map();
  
            //   data.messages.forEach((message:any) => {
            //     const sender = message.senderId;
            //     const receiver = message.receiverId;
  
            //     // Add the sender as a contact if it's not the current user
            //     if (sender && sender._id !== user.userId && sender._id !== user._id) {
            //       uniqueContactsMap.set(sender._id, sender);
            //     }
  
            //     // Add the receiver as a contact if it's not the current user
            //     if (receiver && receiver._id !== user.userId && receiver._id !== user._id) {
            //       uniqueContactsMap.set(receiver._id, receiver);
            //     }
            //   });
  
            //   // Convert map values to an array and set contacts
            //   setContacts(Array.from(uniqueContactsMap.values()));
            //   console.log("Contacts:", contacts);
            // } else {
            //   console.error("Failed to fetch contacts: Unexpected response structure.");
            // }
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
            {contacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={styles.msgContainer}
                onPress={() => handleContactPress(contact.appliedUsers._id, contact.appliedUsers.userName || contact.appliedUsers.email)}              >
                <Image source={{ uri: contact.appliedUsers?.imageUrl }} style={{backgroundColor: "#eee", width: 50, height: 50, borderRadius: 25}}/>
                <View style={styles.msgTextContainer}>
                <Text style={styles.msgUser}>{contact.appliedUsers.userName || contact.appliedUsers.email}</Text>
                <Text style={styles.msgJob}>{contact.jobTitle}</Text>
                </View>

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
      paddingHorizontal: '5%',
      height: 100,
      borderRadius: 10,
      marginVertical: 10,
      backgroundColor: "#fff",
      alignItems: "center",
      borderWidth: 2,
      borderColor: "#eee",
      elevation: 5,
      marginBottom: 10,
      flexDirection: "row",
      // justifyContent: "space-between",
      gap: 30,
    },
    msgJob:{
      fontSize: 12,
      fontWeight: "bold",
      color: "#333",
    },
    msgTextContainer:{
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "center",
      gap: 5,
      width: "70%",
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
  