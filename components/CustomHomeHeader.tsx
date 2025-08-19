import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';
import LocationTextBar from './LocationTextBar';
import { AntDesign } from '@expo/vector-icons';

// Define the props type
interface SecCustomHeaderProps {
  // title: string;
}

const CustomHeader: React.FC<SecCustomHeaderProps> = ({  }) => {
  const navigation = useNavigation();

  return (  
    <View style={styles.headerContainer}>
      <LinearGradient
      colors={['hsla(202, 85%, 66%, 1)', 'hsla(206, 67%, 46%, 1)']}
      start={[0, 0]}
      end={[1, 0]}
      style={styles.container}
    >
      <View  style={styles.wrapper}>
        <View style={{position: "absolute", right: 340, bottom: 8}}>
      {/* <AntDesign name='left' size={20} color={"black"} onPress={() => navigation.goBack()}/>  */}
      </View>
        <LocationTextBar/>
      {/* <Text style={styles.headerTitle}>{title}</Text> */}
      {/* <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon name="menu" size={28} color="#fff" />
      </TouchableOpacity> */}
      </View>
    </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 120,
    paddingHorizontal: 20,
  },
  wrapper:{
    flexDirection: 'column-reverse',
    justifyContent:'space-between',
    alignItems: 'center',
    width: '100%',    
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    // Elevation for Android
  },
  headerTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 35, // Offset to balance the title due to back button
  },
});

export default CustomHeader;
