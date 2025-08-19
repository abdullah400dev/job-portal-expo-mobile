import React, { useState, useContext } from "react";
import axios from "axios";
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
} from "react-native";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { UserContext } from "../UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import { AntDesign, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";

export default function SignupScreen() {
  const { clearUserData, storeUserData } = useContext(UserContext);
  const [isPressed, setIsPressed] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formTouched, setFormTouched] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const apiBaseUrl = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;
  const router = useRouter();
  const validateEmail = (input: any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleEmailChange = (input: any) => {
    setEmail(input);
    setIsValidEmail(validateEmail(input));
  };

  const validatePassword = (input: any) => {
    return input.length >= 6; // Check if the password has at least 6 characters
  };

  const handlePasswordChange = (input: any) => {
    setPassword(input);
    setIsValidPassword(validatePassword(input));
  };

  const loginUser = async (credentials: any) => {
    try {
      await clearUserData();

      // Step 1: Login the user and get the token
      const loginResponse = await fetch(
        `${apiBaseUrl}/api/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        const token = loginData.token;
        await AsyncStorage.setItem("authToken", token);

        // Step 2: Use the token to fetch all user data
        const userResponse = await fetch(
          `${apiBaseUrl}/api/all-users`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Send token in the Authorization header
            },
          }
        );

        const userData = await userResponse.json();

        if (userResponse.ok) {
          // console.log("Fetched user data:", userData);

          // Step 3: Store the full user data in AsyncStorage
          await storeUserData(userData);
          await AsyncStorage.setItem("user", JSON.stringify(userData));
          return userData;
        } else {
          console.error("Failed to fetch user data:", userData.error);
          return null;
        }
      } else {
        console.error("Login failed:", loginData.error);
        return null;
      }
    } catch (error) {
      console.error("Failed to log in:", error);
      return null;
    }
  };

  const handleLogin = async () => {
    // if (!isValidEmail || !isValidPassword) {
    //   Alert.alert("Error", "Please fill in all fields correctly.");
    //   return;
    // }

    setFormTouched(true);
    setIsLoading(true); // Disable the button and change color


    //Validate Email
    const isEmailValid = validateEmail(email);
    setIsValidEmail(isEmailValid);
    setEmailError(isEmailValid ? "" : "Please enter a valid email address.");

    //Validate Password
    const isPasswordValid = validatePassword(password);
    setIsValidPassword(isPasswordValid);
    setPasswordError(
      isPasswordValid ? "" : "Password must be at least 6 characters long."
    );

    if (!isValidEmail || !isValidPassword) {
      // setGeneralError("Please fill in all fields correctly.");
      // setIsLoading(false); // Re-enable the button
      // return;
    }

    const requestData = {
      email: email,
      password: password,
    };

    try {
      const user = await loginUser(requestData);

      if (user) {
        // Alert.alert("Success", "Login successful");

        // Log user information for debugging purposes
        // console.log("Logged in user:", user.user.employer);

        // Navigate to the main tab layout
        if (user) {
          router.push(user.user.employer === 'employer' ? '/(employer)' : '/(tabs)');
        } else {
          router.push('/(tabs)'); // Navigate to the Employee screen
        }
      } else {
        Alert.alert("Error", "Invalid email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Failed to log in. Please try again later.");
    } finally {
      setIsLoading(false); // Re-enable the button
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 60 })} // Adjust this offset based on your UI needs
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
            <Text style={styles.signUpWithText}>Sign In with</Text>
            <Text style={styles.signUpWithSubText}>email, phone number or</Text>
            {/* Social Media Buttons */}
            <View style={styles.socialButtonsContainer}>
              <TouchableOpacity style={styles.socialButton}>
                {/* <Image
                  source={require("../../assets/images/linkedin.png")}
                  style={styles.socialIcon}
                /> */}
               
               
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
              >
                <Image
                  source={require('../../assets/images/google-icon.png')}
                  style={styles.socialIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                {/* <Image
                  source={require("../../assets/images/gmail.png")}
                  style={styles.socialIcon}
                /> */}
                <View>
                  {/* <AntDesign name="apple-o" size={28} color="black" /> */}
                  <Image
                   
                  source={require("../../assets/images/apple-logo.png")}
                  style={styles.appleIcon}
                />
                </View>
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
                  placeholderTextColor="#B0B7BB"
                  placeholder="hello@gmail.com"
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
            <View style={[styles.inputWrapper,
            formTouched && !isValidPassword ? styles.errorBorder : null,
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
                  placeholder="Enter Password"
                  secureTextEntry={true}
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
          </View>
          {(!isValidEmail || !isValidPassword)
            && generalError ? (
            <Text style={styles.errorText}>{generalError}</Text>
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
            onPress={handleLogin}
            disabled={isLoading} // Disable the button when loading
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? "Signing In..." : "SIGN IN"}{" "}
              {/* Change text while loading */}
            </Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.bottomContainer}>
            <Text style={styles.footerText}>
              Create a new account{" "}
              <Link href={"/"}>
                <Text style={styles.signInText}>Sign Up</Text>
              </Link>
            </Text>
            <Text style={styles.footerText}>
              <Link href={"/request-code"}>
                <Text style={styles.signInText}>Forgot your Paswword?</Text>
              </Link>
            </Text>
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
    paddingHorizontal: 40,
    // paddingVertical: 20,
    // justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
    marginTop:30,
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
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  Orcontainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10, // Adjust for spacing above and below the divider
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc", // Color of the lines
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
    // marginBottom: 20,
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
    // backgroundColor:"red",
    alignItems:"center"
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
    marginTop: "20%",
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
  errorBorder: {
    borderColor: "red",
    borderWidth: 1,
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
    // flex: 1,
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
  dropdownIcon: {
    width: 20,
    height: 20,
    objectFit: "contain",
  },

  footerText: {
    textAlign: "center",
    color: "#434B50",
    fontSize: 17.5,
    fontWeight: "400",
    marginBottom: 0,
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
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 30, // Adjust this to add some space from the bottom
  },
  signUpButtonDisabled: {
    backgroundColor: "#A9A9A9", // Gray color when disabled
  },
});
