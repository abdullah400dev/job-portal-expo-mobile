import React, { useContext, useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { UserContext } from "../UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import  Constants from "expo-constants";
type Message = {
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: Date;
};

export default function ChatScreen() {
  const { contactId } = useLocalSearchParams(); // Get the contactId from query parameters
  const { user, getSwipedCardIds } = useContext(UserContext);
  const [receiverId, setReceiverId] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null); // State to store jobId
  const [jobName, setJobName] = useState<string | null>(null); // State to store job name
  const [messageText, setMessageText] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]); // State to store messages
  const [sending, setSending] = useState<boolean>(false); // State to manage button state
  const apiBaseUrl = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;
  const router =  useRouter();

  // Fetch stored receiverId and jobId from AsyncStorage
  useEffect(() => {
    const fetchSwipedData = async () => {
      try {
        // const storedData = await AsyncStorage.getItem('reciveID');
        const storedData = await AsyncStorage.getItem('swipedUser');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setReceiverId(parsedData.userId); // Set receiverId from stored data
          setJobId(parsedData.jobId); // Set jobId from stored data
          // console.log("Fetched data from AsyncStorage:", parsedData);
        } else {
          // console.log("No data found in AsyncStorage.");
        }
      } catch (error) {
        console.error("Failed to retrieve swiped card data:", error);
      }
    };

    fetchSwipedData();
  }, [getSwipedCardIds]);

  // Fetch the job name when jobId changes
  useEffect(() => {
    const fetchJobName = async () => {
      if (!jobId) return; // Ensure jobId is set

      try {
        console.log("JObId: ", jobId)
        const response = await fetch(`${apiBaseUrl}/api/get-specific-job?jobId=${jobId}`);
        const data = await response.json();
        // console.log("Job: ",response)
        if (response.ok) {
          setJobName(data.jobTitle); // Set job name from response
          // console.log("Fetched Job Name:", data.jobTitle);
        } else {
          console.error("Failed to fetch job name:", data.error);
        }
      } catch (error) {
        console.error("Error fetching job name:", error);
      }
    };

    fetchJobName();
  }, [jobId]);

  // Fetch messages when receiverId, userId, or jobId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user.userId || !jobId) return; // Ensure both userId and jobId are set

      setMessages([]); // Clear current messages before fetching new ones   
      console.log("User1231234; ", user.userId)   
      console.log("job; ", jobId)   

      try {
        const response = await fetch(
          `${apiBaseUrl}/api/get-messages?userId=${user.userId}&jobId=${jobId}`
        );
        const data = await response.json();

        if (response.ok) {
          if (data.messages.length > 0) {
            setMessages(data.messages); // Set the messages state with the fetched data
            // console.log("Fetched Messages:", data.messages);
          } else {
            setMessages([]); // Ensure messages are cleared if no messages are returned
          }
        } else {
          console.error("Failed to fetch messages:", data.error);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [user._id, user.userId, jobId]);


  const sendMessage = async () => {
    if (!messageText.trim() || sending) {
      // console.log("Message is empty or already sending.");
      return;
    }
    if (!receiverId || !jobId) { // Ensure both receiverId and jobId are present
      console.error("Receiver ID or Job ID is missing.");
      return;
    }
    setSending(true);
    const newMessage = {
      senderId: user.userId || user._id,
      receiverId,
      jobId, // Include the jobId in the message
      text: messageText,
    };
    // console.log("Sending message:", newMessage);
    try {
      const response = await fetch(`${apiBaseUrl}/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      const data = await response.json();
      if (response.ok) {
        const sentMessage = {
          senderId: user.userId,
          receiverId: receiverId!,
          text: data.newMessage.text,
          createdAt: new Date(data.newMessage.createdAt),
        };

        setMessages([...messages, sentMessage]); // Add the new message to the messages array
        setMessageText(""); // Clear the input field after sending the message
        console.log("Message sent successfully.");
      } else {
        console.error("Failed to send message:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false); // Re-enable the button after the request is complete
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["hsla(202, 85%, 66%, 1)", "hsla(206, 67%, 46%, 1)"]} start={[0, 0]} end={[1, 0]} style={styles.header}>
      <View style={{position: "absolute", left: 23}}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <AntDesign name='left' size={25} color="#fff"/> 
      </TouchableOpacity>
      </View>
        <Text style={styles.headerText}>
          {jobName ? `Job: ${jobName}` : "Loading..."} {/* Show job name in header */}
        </Text>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        {messages.map((msg, index) => (
          msg.receiverId === receiverId ? (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.senderId === user.userId ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
          ) : null
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type message here..."
          placeholderTextColor="#B0B7BB"
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity style={styles.sendButton} activeOpacity={1} onPress={sendMessage} disabled={sending}>
          <Image source={require("../../assets/images/send.png")} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  backButton: {
    width: 40, 
    height: 50, 
    justifyContent: "center"
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
  },
  sentMessage: {
    backgroundColor: "#E1FFC7",
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: "#F0F0F0",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopColor: "#E0E0E0",
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#F1F1F1",
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#1F93D6",
    padding: 10,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});
