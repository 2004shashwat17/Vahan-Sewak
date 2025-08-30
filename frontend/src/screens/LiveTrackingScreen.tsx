import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Mechanic } from '../types';

const LiveTrackingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { problem, description, hasPhoto, hasVideo, mobileNumber, mechanic } = route.params as any;

  const [arrivalTime, setArrivalTime] = useState(11);
  const [hasArrived, setHasArrived] = useState(false);
  const [showServiceCompletionModal, setShowServiceCompletionModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setArrivalTime((prev) => {
        if (prev <= 1) {
          setHasArrived(true);
          return 0;
        }
        return prev - 1;
      });
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleStartService = () => {
    // In real app, this would notify the mechanic to start service
    navigation.navigate('ServiceInProgress' as never, {
      problem,
      description,
      hasPhoto,
      hasVideo,
      mobileNumber,
      mechanic
    } as never);
  };

  const handleServiceComplete = () => {
    setShowServiceCompletionModal(true);
  };

  const handleConfirmCompletion = () => {
    setShowServiceCompletionModal(false);
    // In real app, this would finalize payment and complete service
    navigation.navigate('ServiceHistory' as never);
  };

  const handleNeedHelp = () => {
    // In real app, this would open support chat or call
    console.log('Need help pressed');
  };

  const handleCancelService = () => {
    // In real app, this would cancel the service and handle refund
    navigation.navigate('Home' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.info} />
      
      {/* GPS Tracking Header */}
      <View style={styles.gpsHeader}>
        <Text style={styles.gpsTitle}>Live GPS Tracking</Text>
        <View style={styles.trackingIcons}>
          <View style={styles.trackingIcon}>
            <Ionicons name="person" size={24} color={COLORS.white} />
            <Text style={styles.trackingLabel}>You</Text>
          </View>
          <View style={styles.trackingIcon}>
            <Ionicons name="car" size={24} color={COLORS.white} />
            <Text style={styles.trackingLabel}>{mechanic.name}</Text>
          </View>
        </View>
      </View>

      {/* Mechanic Details */}
      <View style={styles.mechanicCard}>
        <View style={styles.mechanicHeader}>
          <View style={styles.mechanicInfo}>
            <Text style={styles.mechanicName}>{mechanic.name}</Text>
            <Text style={styles.mechanicSpecialization}>
              {mechanic.specialization} • {mechanic.rating}★
            </Text>
          </View>
          <TouchableOpacity style={styles.callButton}>
            <Ionicons name="call" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statusContainer}>
          <Ionicons name="location" size={16} color={COLORS.accent} />
          <Text style={styles.statusText}>
            {hasArrived 
              ? 'Mechanic has arrived at your location'
              : `Arriving in ${arrivalTime} minutes`
            }
          </Text>
        </View>
      </View>

      {/* Problem Details */}
      <View style={styles.problemCard}>
        <Text style={styles.problemText}>
          Problem: {problem.name === 'Other / Not Sure' ? 'Custom Problem' : problem.name}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {hasArrived ? (
          <TouchableOpacity style={styles.startServiceButton} onPress={handleStartService}>
            <Text style={styles.startServiceButtonText}>Start Service</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.arrivalInfo}>
            <Text style={styles.arrivalText}>
              Arriving in {arrivalTime} minutes
            </Text>
          </View>
        )}
        
        <View style={styles.secondaryActions}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleNeedHelp}>
            <Ionicons name="help-circle" size={20} color={COLORS.error} />
            <Text style={styles.secondaryButtonText}>Need Help?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton} onPress={handleCancelService}>
            <Ionicons name="close-circle" size={20} color={COLORS.error} />
            <Text style={styles.secondaryButtonText}>Cancel Service</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Service Completion Modal */}
      <Modal
        visible={showServiceCompletionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowServiceCompletionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Service Completion</Text>
            <Text style={styles.modalMessage}>
              Are you satisfied with the service? This will finalize the payment.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButtonSecondary}
                onPress={() => setShowServiceCompletionModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>NOT YET</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButtonPrimary}
                onPress={handleConfirmCompletion}
              >
                <Text style={styles.modalButtonPrimaryText}>YES, COMPLETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  gpsHeader: {
    backgroundColor: COLORS.info,
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: 'center',
  },
  gpsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 16,
  },
  trackingIcons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  trackingIcon: {
    alignItems: 'center',
  },
  trackingLabel: {
    color: COLORS.white,
    fontSize: 14,
    marginTop: 4,
  },
  mechanicCard: {
    backgroundColor: COLORS.white,
    margin: 20,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mechanicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mechanicInfo: {
    flex: 1,
  },
  mechanicName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  mechanicSpecialization: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  callButton: {
    backgroundColor: COLORS.accent,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
  },
  problemCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  problemText: {
    fontSize: 16,
    color: COLORS.text,
  },
  actionButtons: {
    flex: 1,
    paddingHorizontal: 20,
  },
  startServiceButton: {
    backgroundColor: COLORS.info,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  startServiceButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  arrivalInfo: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  arrivalText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: COLORS.error,
    marginLeft: 8,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    marginHorizontal: 40,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButtonSecondary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  modalButtonSecondaryText: {
    fontSize: 16,
    color: COLORS.info,
    fontWeight: '500',
  },
  modalButtonPrimary: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  modalButtonPrimaryText: {
    fontSize: 16,
    color: COLORS.info,
    fontWeight: '500',
  },
});

export default LiveTrackingScreen;
