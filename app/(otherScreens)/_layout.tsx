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
import { AntDesign } from "@expo/vector-icons";

export default function AuthLayout() {
  const colorScheme = useColorScheme();
const navigation = useNavigation();
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack 
      
      >
        <Stack.Screen
          name="messages"
          options={{
            title: "messages",
            headerShown: false,
          }}
         
        />
        <Stack.Screen
          name="specific-user-messages"
          options={{
            title: "specific-user-messages",
            headerShown: false,
          }}
          
        />
        {/* <Stack.Screen
          name="search-contact"
          options={{
            headerShown: false,
          }}
        /> */}
        
         
          {/* <Stack.Screen
          name="add"
          options={{
            header: () => <SecCustomHeader title="Post Job" />,
          }}
           /> */}
        {/* <Stack.Screen
          name="payment"
          options={{
            header: () => <SecCustomHeader title="Payment" />,
          }} /> */}
      </Stack>
    </ThemeProvider>
  );
}
