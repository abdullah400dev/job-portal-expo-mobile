import React, { useContext } from "react";
import { View, Text, ImageBackground, StyleSheet, Dimensions, Image } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import { FontAwesome } from '@expo/vector-icons';
import { UserContext } from "@/app/UserContext"; // Import your context if needed
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

type CardData = {
  id: string;
  name: string;
  location: string;
  description: string;
  image: string;
  jobTitle: string;
  jobId: string
};

type SwipeableCardProps = {
  onSwipe: () => void;
  cardData: CardData;
  incrementCount: () => void;
};


export default function SwipeableCardSec({
  onSwipe,
  cardData,
  incrementCount
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const isSwipedLeft = useSharedValue(false); // Track swipe direction

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > 100) {
        // Determine if the swipe was to the right
        isSwipedLeft.value = event.translationX < 0;
        translateX.value = withTiming(
          event.translationX < 0 ? -width : width,
          undefined,
          () => {
            if (!isSwipedLeft.value) {
              // Only trigger onSwipe if swiped right (event.translationX > 0)
              runOnJS(onSwipe)();
            }
            // Always increment count after a swipe
            runOnJS(incrementCount)();
          }
        );
      } else {
        translateX.value = withSpring(0);  // Reset position if swipe is too short
      }
    },
  });
  


  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.cardContainer, animatedCardStyle]}>
        <ImageBackground source={{ uri: cardData.image }} style={styles.profileImage}>
          <View style={styles.overlay}>
            <View style={styles.textContainer}>
              <Text style={styles.nameText}>{cardData.jobTitle}</Text>
              <Text style={styles.nameText}>{cardData.name}</Text>
              <Text style={styles.locationText}>{cardData.location}</Text>
              <Text style={styles.descriptionText}>{cardData.description}</Text>
              <View style={styles.swipeContainer}>
              <Image style={{marginTop: 8,marginRight: 10,}} source={require('../assets/images/swipe-left.png')}/>
              <Text style={{color: '#007DC5', fontWeight: '800',fontSize: 13,}}>Swipe</Text>
              <Image style={{marginBottom: 4,marginLeft: 10,}} source={require('../assets/images/swipe-right.png')}/>
              </View>
            </View>
          </View>
        </ImageBackground>
      </Animated.View>
    </PanGestureHandler>
  );
}

const styles = StyleSheet.create({
  swipeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
     },
  cardContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  textContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    margin: 15,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  locationText: {
    fontSize: 16,
    color: "#000",
    marginTop: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: "#000",
    marginTop: 10,
  },
  iconContainer: {
    position: "absolute",
    top: "50%",
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  rightArrow: {
    right: 250,
  },
  leftArrow: {
    left: 250,
  },
  arrowImage:{
    height: 50,
    width: 90,
    objectFit: "cover",

  }
});
