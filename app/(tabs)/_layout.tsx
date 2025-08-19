import React from "react";
import { Tabs } from "expo-router";
import { Platform, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import SecCustomHeader from "@/components/secCustomHeader";
import CustomHeader from "@/components/CustomHomeHeader";
export default function TabLayout() {

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#32ADE6",
        tabBarInactiveTintColor: "#32ADE6",
        tabBarStyle: {
          height: Platform.select({
            ios: 60,
            android: 60,
          }),
          borderTopWidth: 0,
          elevation: 0,
          borderRadius: 50,
          width: "90%",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 10,
          paddingBottom: 10,
          marginBottom: 10,
          marginHorizontal: "auto",
          backgroundColor: "white",
        },
        // headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "community") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "all-message") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
          } else {
            iconName = "ellipse"; // Fallback icon
          }

          return (
            <View
              style={{
                width: 50,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 25,
                backgroundColor: focused ? "#32ADE6" : "transparent",
              }}
            >
              <Ionicons
                name={iconName}
                size={size}
                color={focused ? "white" : color}
              />
            </View>
          );
        },
        tabBarLabel: ({ focused }) => null,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          header: () => <CustomHeader />,
        }}
      />

      <Tabs.Screen
        name="community"
        options={{
          header: () => <SecCustomHeader title="profile Update" />,
        }}
      />

      <Tabs.Screen
        name="all-message"
        options={{
          header: () => <SecCustomHeader title="All Messages" />,
        }}
        // options={{ title: "All Messages", headerShown: true }}
      />
    </Tabs>
  );
}
