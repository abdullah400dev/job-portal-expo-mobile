import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { UserContext } from "../UserContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AntDesign, FontAwesome } from "@expo/vector-icons"; // Import icons for the info icon
import  Constants  from "expo-constants";
type Message = {
  senderId: any;
  receiverId: any;
  text: any;
  createdAt: Date;
  jobId?: any; // Optional jobId
};
const { width, height } = Dimensions.get("window");


export default function ChatScreen() {
  const { contactId, userName } = useLocalSearchParams(); // Get the contactId from query parameters
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState<Message[]>([]); // State to store messages
  const [messageText, setMessageText] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false); // State to manage button state
  const [loading, setLoading] = useState<boolean>(true); // State to manage loading state
  const [selectedJob, setSelectedJob] = useState<any>(null); // State to store selected job details
  const [showModal, setShowModal] = useState<boolean>(false); // State to manage modal visibility
  const [jobLoading, setJobLoading] = useState<boolean>(false); // State to manage job details loading
  const apiBaseUrl = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;
  const router = useRouter();
  // Fetch messages when contactId or userId changes
  useEffect(() => {
    const fetchMessages = async () => {
      const userID = user._id || user.userId;
      if (!userID || !contactId) return; // Ensure both userId and contactId are set

      try {
        const response = await fetch(
          `${apiBaseUrl}/api/specificUser-messages?userId=${userID}&otherUserId=${contactId}`
        );
        const data = await response.json();

        if (response.ok) {

          setMessages(data.messages); // Set the messages state with the fetched data
        } else {
          console.error("Failed to fetch messages:", data.error);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching is complete
      }
    };

    fetchMessages();
  }, [user.userId, contactId, user._id]);

  const sendMessage = async () => {
    if (!messageText.trim() || sending) {
      return;
    }

    if (!contactId) {
      // Ensure contactId is present
      console.error("Contact ID is missing.");
      return;
    }

    setSending(true);

    const newMessage = {
      senderId: user.userId || user._id,
      receiverId: contactId, // Use contactId as receiverId
      text: messageText,
    };

    // console.log("Sending message:", newMessage);

    try {
      const response = await fetch(
        `${apiBaseUrl}/api/specific-user-reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        }
      );

      const data = await response.json();
      if (response.ok) {
        const sentMessage = {
          senderId: user.userId || user._id,
          receiverId: contactId!,
          text: data.newMessage.text,
          createdAt: new Date(data.newMessage.createdAt),
        };
console.log("Message sent:", sentMessage);
        setMessages([...messages, sentMessage]); // Add the new message to the messages array
        setMessageText(""); // Clear the input field after sending the message
        // console.log("Message sent successfully.");
      } else {
        console.error("Failed to send message:", data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false); // Re-enable the button after the request is complete
    }
  };

  // Function to fetch job details
  const fetchJobDetails = async (jobId: string) => {
    setJobLoading(true); // Start job details loading
    try {
      const response = await fetch(`${apiBaseUrl}/api/get-specific-job?jobId=${jobId}`);
      const jobData = await response.json();
      if (response.ok) {
        setSelectedJob(jobData); // Set job details
        setShowModal(true); // Show modal popup
      } else {
        console.error("Failed to fetch job details:", jobData.error);
        Alert.alert("Error", "Failed to fetch job details.");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      Alert.alert("Error", "Error fetching job details.");
    } finally {
      setJobLoading(false); // Stop job details loading
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["hsla(202, 85%, 66%, 1)", "hsla(206, 67%, 46%, 1)"]}
        start={[0, 0]}
        end={[1, 0]}
        style={styles.header}
      >
        <View style={{position: "absolute", left: 23}}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
      <AntDesign name='left' size={25} color="#fff"/> 
      </TouchableOpacity>
        </View>
        <Text style={styles.headerText}>
         {userName}
         {user.id}
         
        </Text>
      </LinearGradient>

      {loading ? ( // Show loader while loading
        <ActivityIndicator size="large" color="#1F93D6" style={styles.loader} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <View
                key={index}
                style={[
                  styles.messageBubble,
                  msg.senderId === (user.userId || user._id)
                    ? styles.sentMessage
                    : styles.receivedMessage,
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
                {msg.jobId && ( // Display info icon if jobId exists
                  <TouchableOpacity
                    style={styles.infoIcon}
                    onPress={() => fetchJobDetails(msg.jobId)}
                  >
                    <FontAwesome name="info-circle" size={20} color="#1F93D6" />
                  </TouchableOpacity>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.noMessagesText}>No messages found.</Text>
          )}
        </ScrollView>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Type message here..."
          placeholderTextColor="#B0B7BB"
          value={messageText}
          onChangeText={setMessageText}
        />
        <TouchableOpacity
          style={styles.sendButton}
          activeOpacity={1}
          onPress={sendMessage}
          disabled={sending}
        >
          <Image source={require("../../assets/images/send.png")} />
        </TouchableOpacity>
      </View>

      {/* Modal for displaying job details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {jobLoading ? ( // Show loader while job details are loading
              <ActivityIndicator size="large" color="#1F93D6" />
            ) : selectedJob ? (
              <>
                <Text style={styles.modalTitle}>{selectedJob.jobTitle}</Text>
                <Text style={styles.modalDescription}>{selectedJob.description}</Text>
              </>
            ) : (
              <Text>Loading job details...</Text>
            )}
            <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "80%",
    flexDirection: "row",
    alignItems: "center",
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
    flex: 1,
  },
  noMessagesText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
    marginTop: 20,
  },
  backButton: {
    width: 40, 
    height: 50, 
    justifyContent: "center"
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
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoIcon: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    textAlign: "center",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#1F93D6",
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
