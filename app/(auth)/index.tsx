import React from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  ScrollView,
  Pressable,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

// Function to select the appropriate image and label based on the role
const getImageAndLabel = (role: string) => {
  if (role === "employer") {
    return {
      image: require("../../assets/images/employer.png"),
      label: "Employer",
    };
  } else if (role === "seeker") {
    return {
      image: require("../../assets/images/jobSeeker.png"),
      label: "Job Seeker",
    };
  }
  return {
    image: require("../../assets/images/zero-white.png"),
    label: "",
  }; // Default image if role doesn't match
};

export default function WelcomeScreen() {
  // Function to handle card press and log the role
  const handlePress = (role: any) => {
    // console.log(`Pressed on: ${role}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.wrapper}>
          <Text style={styles.title}>Welcome to ZERO</Text>
          <Text style={styles.subtitle}>
            {/* Choose whether you want to buy something{"\n"} or you run a local
            business that {"\n"}needs more customers. */}
            Where talent meets opportunity.
            {"\n"}Explore exciting job openings, apply effortlessly,
            {"\n"} and connect with employers to elevate career.
          </Text>

          <View style={styles.cardContainer}>
            {["employer", "seeker"].map((role) => {
              const { image, label } = getImageAndLabel(role);
              return (
                <Link
                  href={{ pathname: "/signup", params: { role } }}
                  asChild
                  key={role}
                >
                  <Pressable
                    style={styles.card}
                    onPress={() => handlePress(role)} // Handle press and log the role
                  >
                    <ImageBackground
                      source={image}
                      style={styles.image}
                      imageStyle={styles.imageStyle}
                    >
                      <View style={styles.overlay} />
                      <Text style={styles.label}>{label}</Text>
                    </ImageBackground>
                  </Pressable>
                </Link>
              );
            })}
          </View>
        </View>
        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Link href={"/login"}>
            <Text style={styles.signInText}>Sign In</Text>
          </Link>
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: width * 0.10, // 5% padding on both sides
    paddingVertical: height * 0.02, // 5% padding on top and bottom
  },
  wrapper: {
    alignItems: "center",
  },
  title: {
    fontSize: 25, // Responsive font size
    fontWeight: "bold",
    color: "#2684FF",
    marginTop: height * 0.04,
    marginBottom: height * 0.02,

    textAlign: "center",
  },
  subtitle: {
    fontSize: 14, // Responsive font size
    color: "#000000",
    lineHeight: height * 0.03, // Responsive line height
    textAlign: "center",
    marginBottom: height * 0.04,
  },
  cardContainer: {
    width: "100%",
  },
  card: {
    marginBottom: height * 0.03, // Responsive margin between cards
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: height * 0.3, // Responsive image height
    justifyContent: "center",
    alignItems: "center",
  },
  imageStyle: {
    borderRadius: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(38, 132, 255, 0.2)",
  },
  label: {
    fontSize: width * 0.05, // Responsive font size for label
    fontWeight: "bold",
    color: "#fff",
  },
  footerText: {
    textAlign: "center",
    color: "#434B50",
    fontSize: width * 0.045, // Responsive font size
    fontWeight: "400",
    marginTop: height * 0.02,
    marginBottom: height * 0.04,
  },
  signInText: {
    color: "#007DC5",
    fontWeight: "bold",
    fontSize: width * 0.045, // Responsive font size
  },
});
