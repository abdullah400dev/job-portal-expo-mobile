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
import { useRouter } from "expo-router";
import { UserContext } from "../UserContext";
import  Constants  from "expo-constants";
import { MaterialIcons } from "@expo/vector-icons";
export default function RequestCode() {
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const apiBaseUrl = (Constants.expoConfig?.extra as { API_URL: string }).API_URL;
  const router = useRouter();

  const validateEmail = (input:any) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const handleEmailChange = (input:any) => {
    setEmail(input);
    setIsValidEmail(validateEmail(input));
  };

  const handleRequestResetCode = async () => {
    if (!isValidEmail) {
      setFormTouched(true)
      setEmailError(isValidEmail ? "" : "Please enter a valid email address.");
      // Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    setFormTouched(false)
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/request-password-reset`,
        { email }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Password reset code sent to your email.");
        router.push("/forgot-password"); // Navigate to the next screen to enter the code
      } else {
        Alert.alert("Error", response.data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error during password reset request:", error);
      Alert.alert("Error", "Failed to request password reset. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.select({ ios: 60, android: 60 })}
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
            <Text style={styles.signUpWithText}>Reset Password</Text>
            <Text style={styles.signUpWithSubText}>
              Enter your email to receive a reset code.
            </Text>
          </View>

          {/* Form Inputs */}
          <View style={styles.inputContainer}>
            {/* <View style={styles.inputWrapper}> */}
            <View style={[styles.inputWrapper,
            formTouched && !isValidEmail ? styles.errorBorder : null]}
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
          </View>

          {/* Request Reset Code Button */}
          <TouchableOpacity
            style={[
              styles.signUpButton,
              isLoading && styles.signUpButtonDisabled,
            ]}
            onPress={handleRequestResetCode}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? "Requesting..." : "Request Code"}
            </Text>
          </TouchableOpacity>
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
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerWrapper: {
    marginBottom: 30,
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
  errorBorder: {
    borderColor: "red",
    borderWidth: 1,
  },
  errorText: {
    color: "red",
    marginTop: -8,
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: "#1F93D6",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    width: "80%",
    marginBottom: 30,
    marginTop: 30,
    marginHorizontal: "auto",
    shadowColor: Platform.select({
      ios: "rgba(43, 80, 48, 0.5)",
      android: "rgba(43, 80, 48, 0.9)",
    }),
    shadowOffset: { width: 0, height: 9 },
    shadowOpacity: Platform.select({
      ios: 0.5,
      android: 0.5,
    }),
    shadowRadius: Platform.select({
      ios: 10,
      android: 1,
    }),
    elevation: 10,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpButtonDisabled: {
    backgroundColor: "#A9A9A9", // Gray color when disabled
  },
});
