import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { useRouter, useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import Constants from 'expo-constants';
import * as Location from 'expo-location';  // Import the Location module
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
  Linking,
} from "react-native";
import { Link } from "expo-router";
import { UserContext } from "../UserContext";
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";

export default function SignupScreen() {
  const { role } = useLocalSearchParams();
  const initialRole = role || "EMPLOYER";
  const { clearUserData, storeUserData } = useContext(UserContext);
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setuserName] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [phone, setPhone] = useState("");
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [password, setPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [reenterPassword, setReenterPassword] = useState("");
  const [isPasswordMatch, setIsPasswordMatch] = useState(false);
  const [nameError, setNameError] = useState("")
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [formTouched, setFormTouched] = useState(false);
  const [isValidName, setIsValidName] = useState(false);
  const [location, setLocation] = useState<string | null>(null);

  const apiBaseUrl = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;
  const validateName = (input: any) => {
    return input.length >= 1; // Check if the password has at least 6 characters
  };

  const handleNameChange = (input: any) => {
    setuserName(input);
    // setIsValidName(validateName(input));
    setIsValidName(validateName(input));
  };

  const validateEmail = (input: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleEmailChange = (input: any) => {
    setEmail(input);
    const isValid = validateEmail(input);
    setIsValidEmail(isValid);
  };

  const validatePhone = (input: any) => {
    const phoneRegex = /^(\+?[0-9]{10,14}|[0-9]{10,14})$/;
    // const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(input);
  };

  const handlePhoneChange = (input: any) => {
    setPhone(input);
    const isValid = validatePhone(input);
    setIsValidPhone(isValid);
  };

  const validatePassword = (input: any) => {
    return input.length >= 6;
  };

  const handlePasswordChange = (input: any) => {
    setPassword(input);
    const isValid = validatePassword(input);
    setIsValidPassword(isValid);
    setIsPasswordMatch(input === reenterPassword);
  };

  const handleReenterPasswordChange = (input: any) => {
    setReenterPassword(input);
    const isMatch = input === password;
    setIsPasswordMatch(isMatch);
  };

  const router = useRouter();
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permission to access location was denied');
        return;
      }

      let { coords } = await Location.getCurrentPositionAsync({});
      let response = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      for (let item of response) {
        let address = `${item.name}, ${item.city}, ${item.region}`;
        setLocation(address);
      }
    } catch (error) {
      Alert.alert(
        "Location Access Required",
        "To enhance your experience, we require access to your device's location.",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings()
          },
        ],
        { cancelable: false }
      );
    }
  };
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const handleSignup = async () => {
    setFormTouched(true); // Mark the form as touched
    setIsLoading(true); // Disable the button and change color

    //validate Name
    const isValidName = validateName(userName);
    setIsValidName(isValidName);
    setNameError(isValidName ? "" : "Please enter a username.")

    // Validate email
    const isEmailValid = validateEmail(email);
    setIsValidEmail(isEmailValid);
    setEmailError(isEmailValid ? "" : "Please enter a valid email address.");

    // Validate phone
    const isPhoneValid = validatePhone(phone);
    setIsValidPhone(isPhoneValid);
    setPhoneError(isPhoneValid ? "" : "Please enter a valid phone number.");

    // Validate password
    const isPasswordValid = validatePassword(password);
    setIsValidPassword(isPasswordValid);
    setPasswordError(
      isPasswordValid ? "" : "Password must be at least 6 characters long."
    );

    // Validate password match
    const isPasswordMatching = password === reenterPassword;
    setIsPasswordMatch(isPasswordMatching);
    setConfirmPasswordError(
      isPasswordMatching ? "" : "Passwords do not match."
    );

    // If any validation fails, do not proceed with the signup
    if (
      !isValidName ||
      !isEmailValid ||
      !isPhoneValid ||
      !isPasswordValid ||
      !isPasswordMatching

    ) {
      // setGeneralError("Please fill in all fields correctly.");
      setIsLoading(false); // Re-enable the button
      return;
    }

    const requestData = {
      email: email,
      userName: userName,
      phoneNumber: phone,
      employer: selectedRole,
      password: password,
      confirmPassword: reenterPassword,
      location: location || 'Location not available', // Add the location to the request data

    };

    await clearUserData();

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/adduser`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("API Response:", response.data);

      if (response.status === 201) {
        // Alert.alert("Success", "User created successfully");

        const newUser = response.data;
        // console.log("Logged in user:", newUser);
        // console.log("Logged in user employer:", newUser.user.employer);


        if (newUser) {
          await AsyncStorage.setItem("authToken", newUser.token);
          await storeUserData(newUser);

          router.push("/(auth)/AdditionDetails"); // Navigate to Additional Details
        } else {
          console.error("Signup error: Received undefined user data");
          setGeneralError("Signup failed. Received invalid user data.");
        }
      } else {
        setGeneralError(response.data.error || "Something went wrong");
      }
    } catch (error: any) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        console.error("API Error Response:", error.response.data);
        setGeneralError(
          error.response.data.error || "Failed to sign up. Please try again later."
        );
      } else if (error.request) {
        // Request was made but no response was received
        console.error("API Request Error:", error.request);
        setGeneralError("No response received from the server.");
      } else {
        // Other errors, like network issues or invalid request setup
        console.error("Error during signup:", error.message);
        setGeneralError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false); // Re-enable the button
    }

  };

  const selectedRoleString = Array.isArray(selectedRole)
    ? selectedRole[0]
    : selectedRole || "EMPLOYER";

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 100 })} // Adjust this offset based on your UI needs
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={require("../../assets/images/Zero.png")}
              style={styles.logo}
            />
          </View>
          <View style={styles.headerWrapper}>
            {/* Sign up with */}
            <Text style={styles.signUpWithText}>Sign up with</Text>
            <Text style={styles.signUpWithSubText}>email, phone number or</Text>
            {/* Social Media Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                {/* <Image
                  source={require("../../assets/images/linkedin.png")}
                  style={styles.socialIcon}
                /> */}
                <View style={{ height: 35 }}>
                  <Image
                    source={require("../../assets/images/google-icon.png")}
                    style={styles.socialIcon}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <View style={{}}>
                  <Image
                    source={require("../../assets/images/apple-logo.png")}
                    style={styles.appleIcon}
                  />
                </View>
                {/* <Image
                  source={require("../../assets/images/gmail.png")}
                  style={styles.socialIcon}
                /> */}
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.socialButton}>
                <Image
                  source={require("../../assets/images/vk.png")}
                  style={styles.socialIcon}
                />
              </TouchableOpacity> */}
            </View>
          </View>
          {/* Form Inputs */}

          <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper,
            formTouched && !isValidName ? styles.errorBorder : null]}
            >
              {/* <Image
                source={require("../../assets/images/email-icon.png")}
                style={styles.inputIcon}
              /> */}
              <FontAwesome name="user" size={30} color="#007DC5" style={styles.inputIcon} />
              <View style={styles.innerinputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="john doe"
                  placeholderTextColor="#B0B7BB"
                  keyboardType="name-phone-pad"
                  value={userName}
                  onChangeText={handleNameChange}
                />
                {isValidName && (
                  <Image
                    source={require("../../assets/images/icon-2.png")}
                    style={styles.inputIconafter}
                  />
                )}
              </View>
            </View>
            {formTouched && nameError && (
              (!isValidName) ? <Text style={styles.errorText}>{nameError}</Text> : null
            )}
            <View
              style={[
                styles.inputWrapper,
                formTouched && !isValidEmail ? styles.errorBorder : null,
              ]}
            >
              {/* <Image
                source={require("../../assets/images/email-icon.png")}
                style={styles.inputIcon}
              /> */}
              <MaterialIcons name="mail" size={30} color="#007DC5"
                style={styles.inputIcon}
              />
              <View style={styles.innerinputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="hello@gmail.com"
                  placeholderTextColor="#B0B7BB"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={handleEmailChange}
                />
                {isValidEmail && (
                  <Image
                    source={require("../../assets/images/icon-2.png")}
                    style={styles.inputIconafter}
                  />
                )}
              </View>
            </View>
            {formTouched && emailError && (
              (!isValidEmail) ? <Text style={styles.errorText}>{emailError}</Text> : null
            )}

            <View style={styles.Orcontainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>
            <View
              style={[
                styles.inputWrapper,
                formTouched && !isValidPhone ? styles.errorBorder : null,
              ]}
            >

              <FontAwesome name="phone" size={30} color="#007DC5"
                style={styles.inputIcon}
              />
              <View style={styles.innerinputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#B0B7BB"
                  placeholder="+44 31 4396928"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={handlePhoneChange}
                />
                {isValidPhone && (
                  <Image
                    source={require("../../assets/images/icon-2.png")}
                    style={styles.inputIconafter}
                  />
                )}
              </View>
            </View>
            {formTouched && phoneError && (
              (!isValidPhone) ? <Text style={styles.errorText}>{phoneError}</Text> : null
            )}
            <View
              style={[
                styles.inputWrapper,
                // formTouched && !isValidPhone ? styles.errorBorder : null,
              ]}
            >
              <View style={[styles.hidden, { borderWidth: 0 }]}>
                <Image
                  source={require("../../assets/images/russia.png")}
                  style={styles.inputIcon}
                />
                <View style={[styles.innerinputWrapper]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter role"
                    placeholderTextColor="#B0B7BB"
                    value={selectedRoleString} // Display the selectedRoleString value
                    editable={false} // Disable editing
                  />
                </View>
              </View>

              <View style={[styles.hidden, { borderWidth: 0 }]}>
                <Image
                  source={require("../../assets/images/russia.png")}
                  style={styles.inputIcon}
                />
                <View style={[styles.innerinputWrapper]}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter role"
                    placeholderTextColor="#B0B7BB"
                    value={location || ''} // Display the selectedRoleString value
                    editable={false} // Disable editing
                  />
                </View>
              </View>
            </View>
            <View
              style={[
                styles.inputWrapper,
                formTouched && !isValidPassword ? styles.errorBorder : null,
              ]}
            >


              <FontAwesome name="lock" size={30} color="#007DC5"
                style={styles.inputIcon}
              />
              <View style={[styles.innerinputWrapper, { borderTopWidth: 0 }]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Password"
                  secureTextEntry={true}
                  placeholderTextColor="#B0B7BB"
                  value={password}
                  onChangeText={handlePasswordChange}
                />
                {isValidPassword && (
                  <Image
                    source={require("../../assets/images/icon-2.png")}
                    style={styles.inputIconafter}
                  />
                )}
              </View>
            </View>
            {formTouched && passwordError && (
              (!isValidPassword) ? <Text style={styles.errorText}>{passwordError}</Text> : null
            )}

            {/* {formTouched && passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null} */}

            <View
              style={[
                styles.inputWrapper,
                formTouched && !isPasswordMatch ? styles.errorBorder : null,
              ]}
            >
              {/* <Image
                source={require("../../assets/images/russia.png")}
                style={styles.inputIcon}
              /> */}

              <FontAwesome name="lock" size={30} color="#007DC5"
                style={styles.inputIcon}
              />
              <View style={styles.innerinputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#B0B7BB"
                  placeholder="Re Enter Password"
                  secureTextEntry={true}
                  value={reenterPassword}
                  onChangeText={handleReenterPasswordChange}
                />
                {isPasswordMatch && (
                  <Image
                    source={require("../../assets/images/icon-2.png")}
                    style={styles.inputIconafter}
                  />
                )}
              </View>
            </View>
            {formTouched && confirmPasswordError && (
              (!isPasswordMatch) ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null
            )}

            {/* {formTouched && confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null} */}
          </View>

          {/* General Error Message */}
          {(!isValidName || !isValidEmail || !isValidPhone || !isValidPassword || !isPasswordMatch)
            && generalError ? (
            <Text style={styles.errorText}>{generalError}</Text>
          ) : null}
          {generalError ? (
            <Text style={{ color: 'red', textAlign: 'center', fontSize: 16, marginBottom: 10 }}>
              {generalError}
            </Text>
          ) : null}
          {/* Sign Up Button */}
          <TouchableOpacity
            style={[
              styles.signUpButton,
              isPressed && styles.signUpButtonPressed,
              isLoading && styles.signUpButtonDisabled, // Apply disabled style
            ]}
            activeOpacity={1}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
            onPress={handleSignup}
            disabled={isLoading} // Disable the button when loading
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? "Signing Up..." : "SIGN UP"}{" "}
              {/* Change text while loading */}

            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footerText}>
            Already have an account?{" "}
            <Link href={"/login"}>
              <Text style={styles.signInText}>Sign In</Text>
            </Link>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 40,
  },
  signUpButtonDisabled: {
    backgroundColor: "#A9A9A9", // Gray color when disabled
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
    marginTop: 30,
  },
  headerWrapper: {
    marginBottom: 30,
  },
  picker: {
    flex: 1,
    color: "#434B50",
    height: 50,
    fontSize: 16,
  },
  Orcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  orText: {
    marginHorizontal: 10,
    fontWeight: "bold",
    color: "#434B50",
    width: 30,
    fontSize: 16,
    textAlign: "center",
  },
  logo: {
    width: 100,
    height: 50,
    alignSelf: "center",
    objectFit: "contain",
  },
  signUpWithText: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    color: "#262B2E",
  },
  signUpWithSubText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "400",
    color: "#8A8D9F",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  socialButton: {
    marginHorizontal: 5,
  },
  socialIcon: {
    width: 40,
    height: 40,
    objectFit: "contain",
  },
  appleIcon: {
    width: 60,
    height: 50,
    objectFit: "contain",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F5F7",
    borderRadius: 30,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  innerinputWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
  },
  inputIconafter: {
    width: 18,
    height: 18,
    marginRight: 5,
    objectFit: "contain",
  },
  inputIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
    objectFit: "contain",
  },
  input: {
    height: 50,
    width: "90%",
    fontSize: 16,
    paddingLeft: 12,
    color: "#434B50",
  },
  errorText: {
    color: "red",
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 14,
  },
  errorBorder: {
    borderColor: "red",
    borderWidth: 1,
  },
  footerText: {
    textAlign: "center",
    color: "#434B50",
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 40,
  },
  signInText: {
    color: "#007DC5",
    fontWeight: "bold",
    fontSize: 18,
  },
  signUpButton: {
    backgroundColor: "#4BB2EE",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    width: "80%",
    marginBottom: 30,
    marginTop: 30,
    marginHorizontal: "auto",
    shadowColor: Platform.select({
      ios: "rgba(43, 80, 48, 0.5)", // Reduce opacity for iOS
      android: "rgba(43, 80, 48, 0.9)", // Keep as it is for Android
    }),
    shadowOffset: { width: 0, height: 9 }, // Reduce the offset for iOS
    shadowOpacity: Platform.select({
      ios: 0.5, // Lower the opacity for iOS
      android: 0.5, // Keep full opacity for Android
    }),
    shadowRadius: Platform.select({
      ios: 10, // Reduce the blur radius for iOS
      android: 1, // Keep it the same for Android
    }),
    elevation: 10, // Elevation for Android shadow
  },
  signUpButtonPressed: {
    paddingHorizontal: 20,
    width: "82%",
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  selectRole: {
    textTransform: "uppercase",
  },
  hidden: {
    display: 'none',
  }
});
