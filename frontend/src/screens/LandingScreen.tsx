import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LandingScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vahan Sewak</Text>
      <Text style={styles.subtitle}>Delhi NCR's Trusted Vehicle Assistant</Text>
      <View style={styles.iconContainer}>
  <Image source={require('../../assets/icon.png')} style={styles.icon} />
      </View>
      <Text style={styles.heading}>Welcome!</Text>
      <Text style={styles.description}>Choose your role to continue</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('HomeScreen')}>
        <Text style={styles.buttonText}>Customer</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonSecondary} onPress={() => navigation.navigate('MerchantScreen')}>
        <Text style={styles.buttonText}>Merchant</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#263A4A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#263A4A',
    marginBottom: 24,
  },
  iconContainer: {
    backgroundColor: '#FFEBD8',
    borderRadius: 50,
    padding: 16,
    marginBottom: 24,
  },
  icon: {
    width: 48,
    height: 48,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#263A4A',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#263A4A',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FF6B2C',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#263A4A',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
