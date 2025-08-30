import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { PAYMENT_METHODS } from '../constants/data';
import { useNavigation, useRoute } from '@react-navigation/native';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { problem, description, hasPhoto, hasVideo, mobileNumber } = route.params as any;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
  const [showPaymentSuccessModal, setShowPaymentSuccessModal] = useState(false);

  const handlePayment = async () => {
    try {
      // Create payment order on backend
      const response = await fetch('http://localhost:5000/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 99,
          currency: 'INR',
          paymentMethod: selectedPaymentMethod,
          problem: problem.name,
          mobileNumber: mobileNumber
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Initialize Razorpay payment
        const options = {
          key: data.keyId, // Razorpay Key ID
          amount: data.amount,
          currency: data.currency,
          name: 'Vahan Sewak',
          description: `Inspection Fee - ${problem.name}`,
          order_id: data.orderId,
          prefill: {
            contact: mobileNumber,
            email: 'user@example.com'
          },
          theme: {
            color: '#FF6B35'
          },
          handler: function (response: any) {
            // Payment successful
            handlePaymentSuccess(response);
          },
          modal: {
            ondismiss: function() {
              Alert.alert('Payment Cancelled', 'Payment was cancelled by user');
            }
          }
        };

        // Load Razorpay script and initialize payment
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        Alert.alert('Error', data.error || 'Failed to create payment order');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'Payment failed. Please try again.');
    }
  };

  const handlePaymentSuccess = (response: any) => {
    // Verify payment on backend
    verifyPayment(response);
  };

  const verifyPayment = async (paymentResponse: any) => {
    try {
      const response = await fetch('http://localhost:5000/api/payments/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          amount: 99,
          problem: problem.name,
          mobileNumber: mobileNumber
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowPaymentSuccessModal(true);
      } else {
        Alert.alert('Payment Verification Failed', data.error || 'Payment could not be verified');
      }
    } catch (error) {
      console.error('Verification error:', error);
      Alert.alert('Error', 'Payment verification failed');
    }
  };

  const handlePaymentSuccessModal = () => {
    setShowPaymentSuccessModal(false);
    navigation.navigate('MechanicSelection' as never, {
      problem,
      description,
      hasPhoto,
      hasVideo,
      mobileNumber
    } as never);
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
          <Text style={styles.headerTitle}>Inspection Fee</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Service Request */}
        <View style={styles.serviceRequestCard}>
          <Text style={styles.serviceRequestLabel}>Service Request:</Text>
          <Text style={styles.serviceRequestValue}>
            {problem.name === 'Other / Not Sure' ? 'Custom Problem' : problem.name}
          </Text>
        </View>

        {/* Inspection Fee Details */}
        <View style={styles.inspectionFeeCard}>
          <View style={styles.feeHeader}>
            <Text style={styles.feeTitle}>Inspection Fee</Text>
            <Text style={styles.feeAmount}>₹99</Text>
          </View>
          
          <View style={styles.feeBenefits}>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
              <Text style={styles.benefitText}>Fully adjustable against your final bill</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
              <Text style={styles.benefitText}>Only retained if you cancel after dispatch</Text>
            </View>
            <View style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
              <Text style={styles.benefitText}>Covers mechanic travel and initial diagnosis</Text>
            </View>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          
          {PAYMENT_METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod === method.id && styles.selectedPaymentMethod
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <View style={styles.paymentMethodInfo}>
                <Ionicons 
                  name={method.icon as any} 
                  size={24} 
                  color={selectedPaymentMethod === method.id ? COLORS.primary : COLORS.textLight} 
                />
                <Text style={[
                  styles.paymentMethodText,
                  selectedPaymentMethod === method.id && styles.selectedPaymentMethodText
                ]}>
                  {method.name}
                </Text>
                {method.recommended && (
                  <View style={styles.recommendedTag}>
                    <Text style={styles.recommendedText}>Recommended</Text>
                  </View>
                )}
              </View>
              <View style={[
                styles.radioButton,
                selectedPaymentMethod === method.id && styles.radioButtonSelected
              ]}>
                {selectedPaymentMethod === method.id && (
                  <View style={styles.radioButtonInner} />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pay Button */}
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Pay ₹99 & Find Mechanics</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>

        {/* Security Message */}
        <View style={styles.securityContainer}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.accent} />
          <Text style={styles.securityText}>
            Secure payment powered by industry-standard encryption
          </Text>
        </View>
      </View>

      {/* Payment Success Modal */}
      <Modal
        visible={showPaymentSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPaymentSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Payment Successful!</Text>
            <Text style={styles.modalMessage}>
              Your ₹99 inspection fee has been paid. Now finding mechanics near you...
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={handlePaymentSuccessModal}
            >
              <Text style={styles.modalButtonText}>CONTINUE</Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  serviceRequestCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  serviceRequestLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  serviceRequestValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  inspectionFeeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  feeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  feeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  feeBenefits: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 8,
    flex: 1,
  },
  paymentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  paymentMethodCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedPaymentMethod: {
    borderColor: COLORS.primary,
  },
  paymentMethodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },
  selectedPaymentMethodText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  recommendedTag: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  recommendedText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '500',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: COLORS.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  payButton: {
    backgroundColor: COLORS.info,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginRight: 8,
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  securityText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 8,
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

export default PaymentScreen;
