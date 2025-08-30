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

const ProfileScreen = () => {
  const menuItems = [
    {
      id: 'vehicles',
      title: 'My Vehicles',
      icon: 'car',
      onPress: () => console.log('My Vehicles pressed'),
    },
    {
      id: 'payments',
      title: 'Payment Methods',
      icon: 'card',
      onPress: () => console.log('Payment Methods pressed'),
    },
    {
      id: 'help',
      title: 'Help & Support',
      icon: 'help-circle',
      onPress: () => console.log('Help & Support pressed'),
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: 'settings',
      onPress: () => console.log('Settings pressed'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* User Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color={COLORS.textLight} />
        </View>
        <Text style={styles.userName}>Arjun Sharma</Text>
        <Text style={styles.userPhone}>+91 98765 43210</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name={item.icon as any} size={24} color={COLORS.textLight} />
              <Text style={styles.menuItemText}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Emergency Contact */}
      <View style={styles.emergencyContainer}>
        <TouchableOpacity style={styles.emergencyButton}>
          <Text style={styles.emergencyButtonText}>
            Emergency Contact: 1800-VAHAN-911
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  profileCard: {
    backgroundColor: COLORS.white,
    margin: 20,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  userPhone: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 16,
  },
  emergencyContainer: {
    margin: 20,
  },
  emergencyButton: {
    backgroundColor: COLORS.error,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  emergencyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

export default ProfileScreen;
