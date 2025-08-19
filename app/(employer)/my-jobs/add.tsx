import React, { useState, useContext, useEffect } from "react";
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
  Dimensions,
} from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from "../../UserContext";
import axios from 'axios';
import * as ImagePicker from "expo-image-picker";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
const { width, height } = Dimensions.get("window");

// Define the type for job data
type Job = {
  _id: string;
  jobTitle: string;
  location: string;
  status: string;
  [key: string]: any;
};

export default function AddJob() {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);
  const [jobTitle, setJobTitle] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState("");
  const apiBaseUrl = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;

  useEffect(() => {
    const fetchUserId = async () => {
      const userDataString = await AsyncStorage.getItem('user');
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUserId(userData.user?._id || userData._id || user.userId);
      }
    };
    fetchUserId();
  }, []);

  const pickImage = async () => {
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    const libraryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!cameraPermission.granted || !libraryPermission.granted) {
      alert("Permission to access camera and photo library is required!");
      return;
    }

    Alert.alert(
      "Select an option",
      "Choose how you want to select your image",
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

  const handleAddJob = async () => {
    if (!jobTitle || !price || !location || !description) {
      alert('Please fill in all required fields.');
      return;
    }

    if (!userId) {
      alert('User ID is missing.');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = '';

      if (image) {

        const formData: any = new FormData();
        const fileExtension = image.split('.').pop()?.toLowerCase() ?? '';
        let mimeType = 'image/jpeg';

        if (fileExtension === 'png') {
          mimeType = 'image/png';
        } else if (fileExtension === 'gif') {
          mimeType = 'image/gif';
        } else if (fileExtension === 'webp') {
          mimeType = 'image/webp';
        } else if (fileExtension === 'heic' || fileExtension === 'heif') {
          mimeType = 'image/heic';
        }

        const imageUri = image.startsWith("file://") ? image : `file://${image}`;

        formData.append("file", {
          uri: imageUri,
          type: mimeType,
          name: `job_image.${fileExtension}`,
        });

        formData.append("upload_preset", "unsigned_upload");

        const uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/deuplk35n/image/upload`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        imageUrl = uploadResponse.data.secure_url;
      }
      const payload = {
        jobTitle,
        price: parseFloat(price),
        description,
        location,
        status: status || 'inactive',
        imageUrl,
        userId,
      };
      console.log('jobbbbbbbbbbbbbbbbbb',apiBaseUrl)
      const response = await axios.post(`${apiBaseUrl}/api/add-job`, payload,{headers:{"Content-Type" : "application/json"}});
      if (response.status === 201) {
        alert('Job added successfully');
        setJobTitle("");
        setPrice("");
        setLocation("");
        setDescription("");
        setImage("");
        router.push("/(employer)/my-jobs/")
        return;
      } else {
        alert('Failed to add job. Please try again.');
      }
    } catch (error: any) {
      console.error('Error adding job:', error.response.data);
      alert('Error adding job: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.select({ ios: 100, android: 0 })}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        bounces={false}
      >
        <View style={styles.container}>
          {/* <View style={{position: "absolute", top: 50, left: 20}}>
      <AntDesign name='left' size={20} color={"black"} onPress={() => router.back()}/> 
      </View> */}
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
            <Text style={styles.updateText}>Change or Update Image</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Job Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter job title"
              placeholderTextColor="#B0B7BB"
              value={jobTitle}
              onChangeText={setJobTitle}
            />

            <Text style={styles.inputLabel}>Price</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter price"
              placeholderTextColor="#B0B7BB"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />

            <Text style={styles.inputLabel}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter location"
              placeholderTextColor="#B0B7BB"
              value={location}
              onChangeText={setLocation}
            />

            <Text style={styles.descriptionHeader}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Enter job description"
              placeholderTextColor="#B0B7BB"
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.uploadButton, loading && styles.disabledButton]}
              onPress={handleAddJob}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save Job</Text>
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
    marginBottom: height * 0.03,

  },
  updateText: {
    fontSize: width * 0.035,
    marginTop: height * 0.015,
    fontWeight: "400",
    color: "#77838F",

  },
  inputContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    marginBottom: height * 0.03,
  },
  inputLabel: {
    fontSize: width * 0.04,
    fontWeight: "400",
    color: "#1E2022",
    marginBottom: height * 0.01,
  },
  input: {
    fontSize: width * 0.04,
    color: "#434B50",
    fontWeight: "400",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: height * 0.02,
  },
  descriptionHeader: {
    fontSize: width * 0.04,
    fontWeight: "400",
    color: "#1E2022",
    marginBottom: height * 0.01,
  },
  descriptionInput: {
    fontSize: width * 0.04,
    color: "#77838F",
    fontWeight: "400",
    height: height * 0.22,
    textAlignVertical: "top",
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  profileImageContainer: {
    position: "relative",
    width: width * 0.45,
    height: width * 0.45,
    borderRadius: (width * 0.45) / 2,
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
    backgroundColor: "#007DC5",
    padding: 10,
    width: "80%",
    borderRadius: 5,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#A9A9A9",
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
  },
});
