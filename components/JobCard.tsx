import React, { useContext, useState } from "react";
import { View, Text, ImageBackground, StyleSheet, Platform } from "react-native";
import { UserContext } from '../app/UserContext'; 
import { Gesture, PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedGestureHandler,
} from "react-native-reanimated";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';

type CardData = {
  id: number;
  name: string;
  jobTitle: string;
  description: string;
  image: string;
  userId: string;
  userName: string; 
  jobId: string;
  imageUrl: string;
};

type SwipeableCardProps = {
  onSwipe: () => void;
  cardData: CardData;
  index: number;
  totalCards: number;
  incrementCount: () => void;
};

export default function SwipeableCard({
  onSwipe,
  cardData,
  index,
  totalCards,
  incrementCount
}: SwipeableCardProps) {
  const translateX = useSharedValue(0);
  const cardOpacity = useSharedValue(1);
  const rotateZ = useSharedValue(0);
  const showHeart = useSharedValue(false);
  const showCross = useSharedValue(false);
  const { saveSwipedCardId } = useContext(UserContext);

  const saveToAsyncStorage = async (jobId: string, userId: string, userName: string) => {
    try {
      const data = { jobId, userId, userName };
      await AsyncStorage.setItem('reciveID', JSON.stringify(data));
      // console.log("Saved data to AsyncStorage:", data);
    } catch (error) {
      console.error("Failed to save data to AsyncStorage:", error);
    }
  };

  const animatedCardStyle = useAnimatedStyle(() => {
    let topOffset =  index * 30;
    let zIndex = totalCards - index;
    let scale = 1;

    if (index === totalCards - 1) {
      topOffset = 0;
      zIndex = 3;
      scale = 1;
    } else if (index === totalCards - 2) {
      topOffset = 0;
      zIndex = 2;
      scale = 1;
    } else if (index >= totalCards - 3) {
      
      topOffset = (totalCards - 1 - index) * 0; 
      zIndex = 3 - (totalCards - 1 - index); 
      scale = 1; 
    } else {
      
      topOffset = 0 + (index - (totalCards - 3)) * 0;
      zIndex = 1; 
      scale = 1;
    }

    return {
      transform: [
        { translateX: translateX.value },
        { rotateZ: `${rotateZ.value}deg` },
        { scale: scale },
      ],
      opacity: cardOpacity.value,
      zIndex: zIndex,
      top: topOffset,
    };
  });

  const animatedHeartStyle = useAnimatedStyle(() => {
    return {
      opacity: showHeart.value ? 1 : 0,
      transform: [{ scale: showHeart.value ? 1 : 0 }],
      backgroundColor: withTiming(showHeart.value ?  "rgba(255, 0, 0, 0.2)"  : "transparent"),
      overflow: "hidden",
      borderRadius: 20,
    };
  });

  const animatedCrossStyle = useAnimatedStyle(() => {
    return {
      opacity: showCross.value ? 1 : 0,
      transform: [{ scale: showCross.value ? 1 : 0 }],
      backgroundColor: withTiming(showCross.value ? "rgba(0, 128, 0, 0.2)" : "transparent"),
      overflow: "hidden",
      borderRadius: 20,
    };
  });

  const gestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      translateX.value = event.translationX;
      rotateZ.value = event.translationX * 0.15;
      showHeart.value = event.translationX > 50;
      showCross.value = event.translationX < -50;
    },
    onEnd: (event) => {
      if (Math.abs(event.translationX) > 100) {
        if (event.translationX > 0) { 
          runOnJS(incrementCount)();
          // console.log("Swipe Right");
        } else {
          runOnJS(saveSwipedCardId)(cardData.id);
          runOnJS(saveToAsyncStorage)(cardData.jobId, cardData.userId, cardData.userName);
          runOnJS(onSwipe)();
          runOnJS(incrementCount)();
          // console.log("Swipe left on job", cardData.jobId, "by user", cardData.userId);
        }

        translateX.value = withTiming(
          event.translationX > 0 ? 300 : -300,
          undefined,
          () => {
          }
        );
        cardOpacity.value = withTiming(0);
      } else {
        translateX.value = withSpring(0);
        rotateZ.value = withSpring(0);
        showHeart.value = false;
        showCross.value = false;
      }
    },
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[styles.cardContainer, animatedCardStyle, styles.shadowContainer]}>
        <ImageBackground source={{ uri: cardData.imageUrl }} style={styles.profileImage} imageStyle={styles.imageBackground}>
          <View style={styles.overlay}>
            <View style={styles.textContainer}>
              <Text style={styles.nameText}>{cardData.name}</Text>
              {/* <Text style={styles.nameText}>{cardData.userId}</Text>  */}
              <View style={styles.locationContainer}>
                <Text style={styles.locationText}>{cardData.jobTitle}</Text>
              </View>
              <Text style={styles.descriptionText}>{cardData.description}</Text>
            </View>
            <Animated.View style={[styles.iconContainerCross, animatedHeartStyle]}>
            <FontAwesome name="times" size={50} color="rgba(255, 0, 0, 0.8)"/>
              <Text style={styles.cardTextStyle}>Rejected</Text>
            </Animated.View>
            <Animated.View style={[styles.iconContainerHeart, animatedCrossStyle]}>
            <FontAwesome name="check" size={50} color="rgba(0, 128, 0, 0.8)" />
              <Text style={styles.cardTextStyle}>Selected</Text>
            </Animated.View>
          </View>
        </ImageBackground>
      </Animated.View>
    </PanGestureHandler>
  );
}
const styles = StyleSheet.create({
  cardContainer: {
    width: "90%",
    alignSelf: "center",
    borderRadius: 20,
    elevation: Platform.OS === 'android' ? 8 : 10,
    borderColor: '#808080',
    borderWidth: 1,
    position: "absolute",
    left: "5%",
    height: "95%",
  },
  shadowContainer: {
    shadowColor: Platform.select({
      ios: "rgba(0, 0, 0, 0.3)",
      android: "rgba(0, 0, 0, 0.6)",
    }),
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: Platform.select({
      ios: 1,
      android: 0.6,
    }),
    shadowRadius: 5,
  },
  profileImage: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  imageBackground: {
    borderTopRightRadius: 19,
    borderTopLeftRadius: 19,
    borderBottomRightRadius: 19,
    borderBottomLeftRadius: 19,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
    borderRadius: 19,
  },
  textContainer: {
    padding: 15,
  },
  nameText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 16,
    color: "#ddd",
    marginRight: 5,
  },
  descriptionText: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 15,
  },
  iconContainerCross: {
    position: "absolute",
    zIndex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainerHeart: {
    position: "absolute",
    zIndex: 1,
    height: "100%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTextStyle: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "bold",
  },
  idText: {
    fontSize: 16,
    color: "#fff",
  }
});
