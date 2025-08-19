import React, { useState, useContext } from "react";
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
  Button,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../UserContext";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Constants from "expo-constants";

const { width, height } = Dimensions.get("window");

export default function AdditionalDetails() {
  const router = useRouter();
  const [generalError, setGeneralError] = useState("");
  const apiBaseUrl = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;
  const { user, setUser } = useContext(UserContext);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted || !libraryPermission.granted) {
      alert("Permission to access camera and photo library is required!");
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

  const handleUpload = async () => {
    console.log("first");
    if (!image || !description) {
      alert("Please select an image and enter a description");
      return;
    }
       
    setLoading(true);

    try {
      const formData: any = new FormData();
      const fileExtension = image.split(".").pop().toLowerCase();
      let mimeType = "image/jpeg"; // Default to JPEG

      if (fileExtension === "png") {
        mimeType = "image/png";
      } else if (fileExtension === "gif") {
        mimeType = "image/gif";
      } else if (fileExtension === "webp") {
        mimeType = "image/webp";
      } else if (fileExtension === "heic" || fileExtension === "heif") {
        mimeType = "image/heic";
      }

      const imageUri = image.startsWith("file://") ? image : `file://${image}`;

      formData.append("file", {
        uri: imageUri,
        type: mimeType,
        name: `profile.${fileExtension}`,
      });

      formData.append("upload_preset", "unsigned_upload");

      // Upload to Cloudinary
      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/deuplk35n/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const imageUrl = uploadResponse.data.secure_url;

      // Send the imageUrl, email, and description to your server
      const serverResponse = await axios.post(
        `${apiBaseUrl}/api/additional-details`,
        {
          email: user.email,
          description,
          imageUrl,
        }
      );

      if (serverResponse.status === 200) {
        alert("Profile updated successfully");

        const updatedUser = {
          ...user,
          description,
          imageUrl,
        };

        // Remove old storage
        await AsyncStorage.removeItem("user");
        // Save the updated user data with all fields
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        // Update the user context
        setUser(updatedUser);

        router.push("/(auth)/TermsConditions");
      } else {
        alert("Failed to update profile: " + serverResponse.data.error);
      }
    } catch (error: any) {
      console.error("Error during profile update:", error);
      alert("An error occurred: " + error.message);
      if (error.response) {
        console.error("API Error Response:", error.response.data);
        setGeneralError(
          error.response.data.error || "Failed to sign up. Please try again later."
        );
      } else if (error.request) {
        console.error("API Request Error:", error.request);
        setGeneralError("No response received from the server.");
      } else {
        console.error("Error during signup:", error.message);
        setGeneralError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    const placeholderImage = "https://via.placeholder.com/150";

    const updatedUser = {
      ...user,
      imageUrl: placeholderImage,
    };

    // Remove old storage
    await AsyncStorage.removeItem("user");
    // Save the updated user data with all fields
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
    // Update the user context
    setUser(updatedUser);
    // Navigate to the next screen
    router.push("/(auth)/TermsConditions");
  };

  // Determine if the button should be disabled
  const isButtonDisabled = !image || !description;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 90 })}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        bounces={false}
      >
        <View style={styles.container}>
          <View style={styles.profileContainer}>
            <View style={styles.profileImageContainer}>
              {image ? (
                <Image source={{ uri: image }} style={styles.profileImage} />
              ) : (
                <Image
                  source={{ uri: "https://via.placeholder.com/150" }}
                  style={styles.profileImage}
                />
              )}
              <TouchableOpacity style={styles.addButton} onPress={pickImage}>
                <MaterialIcons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <Text style={styles.updateText}>Change or Update Picture</Text>
            <Text style={styles.nameText}>{user.userName}</Text>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionHeader}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Enter description"
              placeholderTextColor="#B0B7BB"
              value={description}
              onChangeText={(text) => setDescription(text)}
              multiline
            />
          </View>

          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity style={styles.uploadButton} onPress={handleSkip}>
              <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
  style={[styles.uploadButton, (loading || isButtonDisabled) && styles.disabledButton]}
  onPress={handleUpload}
  disabled={loading || isButtonDisabled} // Disable button if loading or fields are empty
>
  {loading ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Text style={styles.buttonText}>Save</Text>
  )}
</TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.05,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: height * 0.03, // Responsive margin
  },
  nameText: {
    fontSize: width * 0.05, // Responsive font size
    fontWeight: "bold",
    color: "#1E2022",
    marginTop: height * 0.01,
    marginBottom: height * 0.01,
  },
  updateText: {
    fontSize: width * 0.035, // Responsive font size
    marginTop: height * 0.015,
    fontWeight: "400",
    color: "#77838F",
  },
  descriptionContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    height: height * 0.3, // Responsive height
    marginBottom: height * 0.03, // Responsive margin
  },
  descriptionHeader: {
    fontSize: width * 0.04, // Responsive font size
    fontWeight: "400",
    color: "#1E2022",
    marginBottom: height * 0.01, // Responsive margin
  },
  descriptionInput: {
    fontSize: width * 0.04, // Responsive font size
    color: "#77838F",
    fontWeight: "400",
    height: height * 0.22, // Responsive height
    textAlignVertical: "top",
    borderRadius: 8,
    padding: 10,
  },
  profileImageContainer: {
    position: "relative",
    width: width * 0.45, // Responsive width
    height: width * 0.45, // Responsive height
    borderRadius: (width * 0.45) / 2, // Circular image
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0D86CC",
    backgroundColor: "#fff",
  },
  profileImage: {
    width: "95%",
    height: "95%",
    borderRadius: (width * 0.45) / 2,
    backgroundColor: "#d3d3d3",
  },
  addButton: {
    position: "absolute",
    right: 5,
    bottom: 5,
    backgroundColor: "#0D86CC",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  uploadButton: {
    backgroundColor: "#4BB2EE",
    padding: 10,
    width: "30%",
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.045, // Responsive font size
    fontWeight: "bold",
  },
});
