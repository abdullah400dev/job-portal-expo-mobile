import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import React from "react";
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "@/components/CustomHeader";
import SecCustomHeader from "@/components/secCustomHeader";

export default function AuthLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="signup"
          options={{
            header: () => <CustomHeader title="Sign up" />,
          }}
        />

        <Stack.Screen
          name="login"
          options={{
            header: () => <CustomHeader title="Sign in" />,
          }}
        />

        <Stack.Screen
          name="request-code"
          options={{
            header: () => <CustomHeader title="Sign in" />,
          }}
        />

        <Stack.Screen
          name="forgot-password"
          options={{
            header: () => <CustomHeader title="Sign in" />,
          }}
        />

        <Stack.Screen
          name="TermsConditions"
          options={{
            header: () => <SecCustomHeader title="Sign in" />,
          }}
        />

        <Stack.Screen
          name="AdditionDetails"
          options={{
            header: () => <SecCustomHeader title="Additional Details" />,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
