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
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage
import Constants from "expo-constants";
import { FontAwesome, MaterialIcons, Octicons } from "@expo/vector-icons";
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState(""); // Add state for reset code
  const [newPassword, setNewPassword] = useState(""); // Add state for new password
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [codeError, setCodeError] = useState("")
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formTouched, setFormTouched] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const validatePassword = (input:any) => {
    return input.length >= 6; // Check if the password has at least 6 characters
  };

  const handlePasswordChange = (input:any) => {
    setNewPassword(input);
    setIsValidPassword(validatePassword(input));
  };

  const handleResetPassword = async () => {
    setFormTouched(true);
    setIsLoading(true);

    if(resetCode.length !== 0) {
      setCodeError("")
    } else {
      setCodeError("Please enter your code.")
    }

    const isValidName = validateEmail(email);
    setIsValidEmail(isValidName);
    setEmailError(isValidName ? "" : "Please enter a valid email address.")

    const isPasswordValid = validatePassword(newPassword);
    setIsValidPassword(isPasswordValid);
    setPasswordError(
      isPasswordValid ? "" : "Password must be at least 6 characters long.")

    if (!isValidEmail || !resetCode || !isValidPassword) {
      // Alert.alert("Error", "Please fill in all fields correctly.");
      setGeneralError("Please fill in all fields correctly.");
      setIsLoading(false); // Re-enable the button
      return;
    }


    const requestData = {
      email: email,
      resetCode: resetCode,
      newPassword: newPassword,
    };

    try {
      const response = await axios.post(
        `${apiBaseUrl}/api/reset-password`,
        requestData
      );

      if (response.status === 200) {
        Alert.alert("Success", "Password reset successful.");
        router.push("/login"); // Redirect to login screen after success
      } else {
        Alert.alert("Error", response.data.error || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      Alert.alert("Error", "Failed to reset password. Please try again later.");
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
            {/* Reset Password */}
            <Text style={styles.signUpWithText}>Reset Password</Text>
            <Text style={styles.signUpWithSubText}>
              Enter your email, reset code, and new password.
            </Text>
          </View>
          {/* Form Inputs */}
          <View style={styles.inputContainer}>
            {/* Email Input */}
            {/* <View style={styles.inputWrapper}> */}
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
            {/* Reset Code Input */}
            {/* <View style={styles.inputWrapper}> */}
            <View
              style={[
                styles.inputWrapper,
                formTouched && !resetCode ? styles.errorBorder : null,
              ]}
            >
              {/* <Image
                // source={require("../../assets/images/code-icon.png")}
                source={require("../../assets/images/email-icon.png")}
                style={styles.inputIcon}
              /> */}
              <Octicons name="codescan" size={28} color="#007DC5"
              style={styles.inputIcon}
              />
              <View style={styles.innerinputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#B0B7BB"
                  placeholder="Reset Code"
                  value={resetCode}
                  onChangeText={setResetCode}
                />
                {resetCode && (
                  <Image
                    source={require("../../assets/images/icon-2.png")}
                    style={styles.inputIconafter}
                  />
                )}
              </View>
            </View>
            {formTouched && codeError && (
              (!resetCode) ? <Text style={styles.errorText}>{codeError}</Text> : null
            )}
            {/* New Password Input */}
            {/* <View style={styles.inputWrapper}> */}
            <View
              style={[
                styles.inputWrapper,
                formTouched && !isValidPassword ? styles.errorBorder : null,
              ]}
            >
              {/* <Image
                // source={require("../../assets/images/password-icon.png")}
                source={require("../../assets/images/email-icon.png")}

                style={styles.inputIcon}
              /> */}

<FontAwesome name="lock" size={30} color="#007DC5"
              style={styles.inputIcon}
              />
              <View style={styles.innerinputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholderTextColor="#B0B7BB"
                  placeholder="New Password"
                  secureTextEntry={true}
                  value={newPassword}
                  onChangeText={handlePasswordChange}
                />
                {isValidPassword && (
                  <Image
                    source={require("../../assets/images/icon-2.png")}
                    // source={require("../../assets/images/email-icon.png")}

                    style={styles.inputIconafter}
                  />
                )}
              </View>
            </View>
            {formTouched && passwordError && (
              (!isValidPassword) ? <Text style={styles.errorText}>{passwordError}</Text> : null
            )}
          </View>

          {(!isValidEmail || !isValidPassword || !resetCode) 
          && generalError ? (
            <Text style={styles.errorText}>{generalError}</Text>
          ) : null}

          {/* Reset Password Button */}
          <TouchableOpacity
            style={[
              styles.signUpButton,
              isLoading && styles.signUpButtonDisabled,
            ]}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? "Resetting..." : "Reset Password"}
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
