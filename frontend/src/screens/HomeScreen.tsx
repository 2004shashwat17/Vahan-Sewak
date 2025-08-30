import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleGetHelp = () => {
    navigation.navigate('ProblemSelection' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.appName}>Vahan Sewak</Text>
        <Text style={styles.tagline}>Delhi NCR's Trusted Vehicle Assistant</Text>
        <View style={styles.logoContainer}>
          <Ionicons name="construct" size={40} color={COLORS.primary} />
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        <Text style={styles.mainHeading}>Vehicle Breakdown?</Text>
        <Text style={styles.mainDescription}>
          Get help from verified mechanics near you in Delhi NCR
        </Text>
        
        <TouchableOpacity style={styles.helpButton} onPress={handleGetHelp}>
          <Text style={styles.helpButtonText}>GET HELP NOW</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* Feature Highlights */}
      <View style={styles.featuresContainer}>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.accent} />
          </View>
          <Text style={styles.featureText}>Verified Mechanics</Text>
        </View>
        
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Ionicons name="time" size={24} color={COLORS.accent} />
          </View>
          <Text style={styles.featureText}>15-Min Response</Text>
        </View>
        
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <Ionicons name="star" size={24} color={COLORS.accent} />
          </View>
          <Text style={styles.featureText}>4.8★ Rating</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  mainHeading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 16,
  },
  mainDescription: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  helpButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  helpButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default HomeScreen;
