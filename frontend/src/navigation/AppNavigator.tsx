import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ProblemSelectionScreen from '../screens/ProblemSelectionScreen';
import ProblemDescriptionScreen from '../screens/ProblemDescriptionScreen';
import MobileVerificationScreen from '../screens/MobileVerificationScreen';
import PaymentScreen from '../screens/PaymentScreen';
import MechanicSelectionScreen from '../screens/MechanicSelectionScreen';
import LiveTrackingScreen from '../screens/LiveTrackingScreen';
import ServiceHistoryScreen from '../screens/ServiceHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Emergency Stack Navigator
const EmergencyStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="ProblemSelection" component={ProblemSelectionScreen} />
    <Stack.Screen name="ProblemDescription" component={ProblemDescriptionScreen} />
    <Stack.Screen name="MobileVerification" component={MobileVerificationScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
    <Stack.Screen name="MechanicSelection" component={MechanicSelectionScreen} />
    <Stack.Screen name="LiveTracking" component={LiveTrackingScreen} />
  </Stack.Navigator>
);

// Main Tab Navigator
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'Emergency') {
          iconName = focused ? 'warning' : 'warning-outline';
        } else if (route.name === 'History') {
          iconName = focused ? 'time' : 'time-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else {
          iconName = 'help-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.textLight,
      tabBarStyle: {
        backgroundColor: COLORS.white,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        paddingBottom: 5,
        paddingTop: 5,
        height: 60,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
      },
      headerShown: false,
    })}
  >
    <Tab.Screen 
      name="Emergency" 
      component={EmergencyStack}
      options={{
        tabBarLabel: 'Emergency',
      }}
    />
    <Tab.Screen 
      name="History" 
      component={ServiceHistoryScreen}
      options={{
        tabBarLabel: 'History',
      }}
    />
    <Tab.Screen 
      name="Profile" 
      component={ProfileScreen}
      options={{
        tabBarLabel: 'Profile',
      }}
    />
  </Tab.Navigator>
);

// Main App Navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
