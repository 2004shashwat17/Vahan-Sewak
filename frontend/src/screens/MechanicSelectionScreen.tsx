import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { SAMPLE_MECHANICS } from '../constants/data';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Mechanic } from '../types';

const MechanicSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { problem, description, hasPhoto, hasVideo, mobileNumber } = route.params as any;

  const [selectedMechanic, setSelectedMechanic] = useState<Mechanic | null>(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

  const handleMechanicSelect = (mechanic: Mechanic) => {
    setSelectedMechanic(mechanic);
  };

  const handleConfirmSelection = () => {
    if (selectedMechanic) {
      setShowAssignmentModal(true);
    }
  };

  const handleTrackProgress = () => {
    setShowAssignmentModal(false);
    navigation.navigate('LiveTracking' as never, {
      problem,
      description,
      hasPhoto,
      hasVideo,
      mobileNumber,
      mechanic: selectedMechanic
    } as never);
  };

  const renderMechanicCard = ({ item }: { item: Mechanic }) => {
    const isSelected = selectedMechanic?._id === item._id;
    
    return (
      <TouchableOpacity
        style={[
          styles.mechanicCard,
          isSelected && styles.selectedMechanicCard
        ]}
        onPress={() => handleMechanicSelect(item)}
      >
        <View style={styles.mechanicInfo}>
          <View style={styles.mechanicHeader}>
            <View style={styles.mechanicProfile}>
              <View style={styles.profileImage}>
                <Ionicons name="person" size={32} color={COLORS.textLight} />
              </View>
              <View style={styles.mechanicDetails}>
                <Text style={styles.mechanicName}>{item.name}</Text>
                <Text style={styles.mechanicSpecialization}>{item.specialization}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color={COLORS.warning} />
                  <Text style={styles.ratingText}>
                    {item.rating} ({item.reviews} reviews)
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.mechanicStats}>
            <View style={styles.statItem}>
              <Ionicons name="location" size={16} color={COLORS.textLight} />
              <Text style={styles.statText}>{item.distance} km away</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time" size={16} color={COLORS.textLight} />
              <Text style={styles.statText}>ETA: {item.eta} min</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="card" size={16} color={COLORS.textLight} />
              <Text style={styles.statText}>₹{item.serviceCharge}</Text>
            </View>
          </View>
        </View>
        
        <View style={[
          styles.selectionIndicator,
          isSelected && styles.selectedIndicator
        ]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color={COLORS.white} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Select Mechanic</Text>
        </View>
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.issueText}>
          Issue: {problem.name === 'Other / Not Sure' ? 'Custom Problem' : problem.name}
        </Text>
        <View style={styles.paymentConfirmedTag}>
          <Text style={styles.paymentConfirmedText}>Payment Confirmed</Text>
        </View>
      </View>

      {/* Mechanics List */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Available mechanics near your location</Text>
        
        <FlatList
          data={SAMPLE_MECHANICS}
          renderItem={renderMechanicCard}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.mechanicsList}
        />
      </View>

      {/* Confirm Selection Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.confirmButton,
            selectedMechanic && styles.confirmButtonEnabled
          ]}
          onPress={handleConfirmSelection}
          disabled={!selectedMechanic}
        >
          <Text style={[
            styles.confirmButtonText,
            selectedMechanic && styles.confirmButtonTextEnabled
          ]}>
            Confirm Selection
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color={selectedMechanic ? COLORS.white : COLORS.textLight} 
          />
        </TouchableOpacity>
      </View>

      {/* Mechanic Assigned Modal */}
      <Modal
        visible={showAssignmentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAssignmentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Mechanic Assigned!</Text>
            <Text style={styles.modalMessage}>
              Your selected mechanic has accepted the job and is on the way.
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handleTrackProgress}
            >
              <Text style={styles.modalButtonText}>TRACK PROGRESS</Text>
            </TouchableOpacity>
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
  header: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusBar: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  issueText: {
    fontSize: 14,
    color: COLORS.text,
  },
  paymentConfirmedTag: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  paymentConfirmedText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 16,
  },
  mechanicsList: {
    paddingBottom: 20,
  },
  mechanicCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedMechanicCard: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  mechanicInfo: {
    flex: 1,
  },
  mechanicHeader: {
    marginBottom: 12,
  },
  mechanicProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  mechanicDetails: {
    flex: 1,
  },
  mechanicName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  mechanicSpecialization: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 4,
  },
  mechanicStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 4,
  },
  selectionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  selectedIndicator: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  confirmButton: {
    backgroundColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonEnabled: {
    backgroundColor: COLORS.primary,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginRight: 8,
  },
  confirmButtonTextEnabled: {
    color: COLORS.white,
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
  modalButton: {
    backgroundColor: COLORS.info,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  modalButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default MechanicSelectionScreen;
