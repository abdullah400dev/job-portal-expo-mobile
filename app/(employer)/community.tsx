import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { UserContext } from "../UserContext";
import { useRouter } from "expo-router";
import  Constants  from "expo-constants";

export default function ProfileScreen() {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true); // Loader state for data loading
  const apiBaseUrl = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;
  const router = useRouter();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem("user");
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          const email = userData.user?.email || userData.email || "";
          // console.log("Retrieved Email:", email);
    
          if (email) {
            // Use the email for further actions
            const response = await axios.post(`${apiBaseUrl}/api/get-login-user`, { email });
            
            if (response.status === 200) {
              const fetchedUserData = response.data.user;
              // console.log("Retrieved User Data:", fetchedUserData);
    
              // Update the state with the fetched user data
              setUser(fetchedUserData);
              setName(fetchedUserData.userName || "");
              setEmail(fetchedUserData.email || "");
              setDescription(fetchedUserData.description || "");
              setPhoneNumber(fetchedUserData.phoneNumber || "");
              setImage(fetchedUserData.imageUrl || "");
    
              // Save the fetched user data in AsyncStorage
              await AsyncStorage.setItem("userId", fetchedUserData._id);
              await AsyncStorage.setItem("user", JSON.stringify(fetchedUserData));
            } else {
              Alert.alert("Failed to fetch user data: " + response.data.error);
            }
          } else {
            Alert.alert("Email not found in stored data");
          }
        } else {
          Alert.alert("No user data found in storage");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        Alert.alert("An error occurred while fetching user data.");
      } finally {
        setLoading(false); // Set loading to false once data is loaded
      }
    };

    loadUserData();
  }, []);

  const handleUpdateProfile = async () => {
    // Check if required fields are not null or empty
    if (!name || !email || !phoneNumber || !name.trim() || !email.trim() || !phoneNumber.trim()) {
      Alert.alert('Please fill in all required fields33.');
      return; // Exit the function early to prevent API call
    }
  
    if (password && password !== retypePassword) {
      Alert.alert("Passwords do not match");
      return; // Exit the function early if passwords do not match
    }
  
    setLoading(true);
  
    try {
      const updatedUser = {
        userName: name,
        email,
        phoneNumber,
        description,
        imageUrl: image,
      };
  
      // if (password) {
      //   updatedUser.password = password;
      //   updatedUser.confirmPassword = retypePassword;
      // }
  
      // Debugging: Log the updated user object
      console.log("Updated User Object:", updatedUser);
  
      const response = await axios.post(`${apiBaseUrl}/api/update-profile`, {
        ...updatedUser,
        userId: user._id,
      });
  
      if (response.status === 200) {
        const newUser = { ...user, ...updatedUser };
        setUser(newUser);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        Alert.alert("Profile updated successfully");
      } else {
        Alert.alert("Failed to update profile: " + response.data.error);
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Error Data:", error.response.data);
        Alert.alert("Error: " + error.response.data.error);
      } else {
        console.error("Error Message:", error.message);
        Alert.alert("An error occurred: " + error.message);
      }
    } finally {
      setLoading(false); // Set loading to false after profile update
    }
  };
  
  const pickImage = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted || !libraryPermission.granted) {
      Alert.alert("Permission to access camera and photo library is required!");
      return;
    }

    Alert.alert(
      "Select an option",
      "Choose how you want to select your profile picture",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            let result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          },
        },
        {
          text: "Choose from Library",
          onPress: async () => {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [4, 5],
              quality: 1,
            });

            if (!result.canceled) {
              setImage(result.assets[0].uri);
            }
          },
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007DC5" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 100 })}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            {/* Avatar and Name */}
            <View style={styles.profileImageContainer}>
              <Image source={{ uri: image || "https://via.placeholder.com/150" }} style={styles.profileImage} />
              <TouchableOpacity style={styles.addButton} onPress={pickImage}>
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.updateText}>Change or Update Picture</Text>
            <Text style={styles.nameText}>{name}</Text>
          </View>

          {/* Input Fields */}
          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Name"
                style={styles.input}
                placeholderTextColor="#757575"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Email Address"
                style={styles.input}
                placeholderTextColor="#757575"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Password"
                style={styles.input}
                placeholderTextColor="#757575"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Re-type Password"
                style={styles.input}
                placeholderTextColor="#757575"
                value={retypePassword}
                onChangeText={setRetypePassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Phone Number"
                style={styles.input}
                placeholderTextColor="#757575"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionHeader}>Description</Text>
            <TextInput
              style={styles.descriptionText}
              value={description}
              onChangeText={setDescription}
              multiline
              placeholder="Enter a brief description about yourself"
              placeholderTextColor="#757575"
            />
          </View>

          {/* Update Button */}
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateProfile}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Update Profile</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  profileContainer: {
    alignItems: "center",
    flexDirection: "column",
    marginBottom: 20,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E2022",
    marginTop: 5,
    marginBottom: 5,
  },
  updateText: {
    fontSize: 12,
    marginTop: 15,
    fontWeight: "400",
    color: "#77838F",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#2684FF4D",
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
  descriptionContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  descriptionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: "#757575",
    lineHeight: 20,
  },
  profileImageContainer: {
    position: "relative",
    width: 170,
    height: 170,
    borderRadius: 90,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0D86CC",
    backgroundColor: "#fff",
  },
  profileImage: {
    width: "95%",
    height: "95%",
    borderRadius: 90,
    backgroundColor: "#d3d3d3",
  },
  addButton: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "#0D86CC",
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  updateButton: {
    backgroundColor: "#4BB2EE",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});


