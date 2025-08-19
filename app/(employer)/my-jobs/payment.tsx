import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';




const data: string = ""
export default function PaymentScreen() {
  const [creditCardNumber, setCreditCardNumber] = useState(data);

  const router = useRouter()
  const handleConfirmPayment = () => {
    // Simple validation for demonstration
    if (creditCardNumber.length < 16) {
      Alert.alert('Invalid Credit Card Number', 'Please enter a valid 16-digit credit card number.');
      return;
    }

    // Navigate to OtherScreen if the credit card number is valid
    router.push("/my-jobs/add");
  };

  return (
    <View style={styles.container}>
        {/* <View style={{position: "absolute", top: 50, left: 20}}>
      <AntDesign name='left' size={20} color={"black"} onPress={() => router.back()}/> 
      </View> */}
      <Text style={styles.title}>Confirm Payment</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Credit Card Number"
        keyboardType="numeric"
        maxLength={16} // Assuming a 16-digit card number
        value={creditCardNumber}
        onChangeText={setCreditCardNumber}
      />
      <TouchableOpacity style={styles.button} onPress={handleConfirmPayment}>
        <Text style={styles.buttonText}>Confirm $5 Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // White background
    padding: 20
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#000000' // Black text
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10
  },
  button: {
    backgroundColor: '#4BB2EE', 
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2
  },
  buttonText: {
    color: '#FFFFFF', // White text color
    fontSize: 18
  }
});
