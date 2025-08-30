import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';

const MobileVerificationScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { problem, description, hasPhoto, hasVideo } = route.params as any;

  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [showOtpSentModal, setShowOtpSentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async () => {
    if (mobileNumber.length !== 10) {
      Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number');
      return;
    }

    if (!email || !email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: mobileNumber,
          email: email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowOtpInput(true);
        setShowOtpSentModal(true);
        Alert.alert('OTP Sent!', 'Check your email for the verification code.');
      } else {
        Alert.alert('Error', data.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter a valid 4-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: mobileNumber,
          otp: otp
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowOtpSentModal(false);
        navigation.navigate('Payment' as never, {
          problem,
          description,
          hasPhoto,
          hasVideo,
          mobileNumber
        } as never);
      } else {
        Alert.alert('Error', data.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    handleSendOtp();
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
          <Text style={styles.headerTitle}>Great! Let's get you help</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Problem Selection */}
        <View style={styles.problemSelection}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.accent} />
          <Text style={styles.problemText}>
            Selected: {problem.name === 'Other / Not Sure' ? 'Custom Problem' : problem.name}
          </Text>
        </View>

        {/* Instructions */}
        <Text style={styles.instructions}>
          We need your mobile number to connect you with nearby mechanics.
        </Text>

        {/* Mobile Number Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <View style={styles.mobileInputContainer}>
            <Text style={styles.countryCode}>+91</Text>
            <TextInput
              style={styles.mobileInput}
              placeholder="98765 43210"
              placeholderTextColor={COLORS.textLight}
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        {/* Email Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.emailInput}
            placeholder="your.email@gmail.com"
            placeholderTextColor={COLORS.textLight}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* OTP Input */}
        {showOtpInput && (
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Verification Code</Text>
            <TextInput
              style={styles.otpInput}
              placeholder="1 2 3 4"
              placeholderTextColor={COLORS.textLight}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={4}
            />
            <View style={styles.otpInfo}>
              <Text style={styles.otpInfoText}>
                Code sent to +91 {mobileNumber}. Didn't receive?{' '}
                <Text style={styles.resendText} onPress={handleResendOtp}>
                  Resend
                </Text>
              </Text>
            </View>
          </View>
        )}

        {/* Action Button */}
        <TouchableOpacity 
          style={[
            styles.actionButton,
            (showOtpInput ? otp.length === 4 : (mobileNumber.length === 10 && email.includes('@'))) && styles.actionButtonEnabled
          ]}
          onPress={showOtpInput ? handleVerifyOtp : handleSendOtp}
          disabled={isLoading || !(showOtpInput ? otp.length === 4 : (mobileNumber.length === 10 && email.includes('@')))}
        >
          <Text style={[
            styles.actionButtonText,
            (showOtpInput ? otp.length === 4 : (mobileNumber.length === 10 && email.includes('@'))) && styles.actionButtonTextEnabled
          ]}>
            {isLoading ? 'Sending...' : (showOtpInput ? 'Verify & Continue' : 'Send OTP')}
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color={(showOtpInput ? otp.length === 4 : (mobileNumber.length === 10 && email.includes('@'))) ? COLORS.white : COLORS.textLight} 
          />
        </TouchableOpacity>

        {/* Privacy Message */}
        <View style={styles.privacyContainer}>
          <Ionicons name="lock-closed" size={16} color={COLORS.textLight} />
          <Text style={styles.privacyText}>
            Your number is safe with us. We'll only use it to connect you with mechanics.
          </Text>
        </View>
      </View>

      {/* OTP Sent Modal */}
      <Modal
        visible={showOtpSentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowOtpSentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>OTP Sent</Text>
            <Text style={styles.modalMessage}>
              Verification code sent to +91 {mobileNumber}
            </Text>
            <TouchableOpacity 
              style={styles.modalButton}
              onPress={() => setShowOtpSentModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
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
  problemSelection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  problemText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  instructions: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    marginBottom: 30,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  mobileInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countryCode: {
    fontSize: 16,
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  mobileInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  emailInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  otpInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
  },
  otpInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  otpInfoText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  resendText: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  actionButton: {
    backgroundColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  actionButtonEnabled: {
    backgroundColor: COLORS.primary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginRight: 8,
  },
  actionButtonTextEnabled: {
    color: COLORS.white,
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  privacyText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 8,
    lineHeight: 20,
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

export default MobileVerificationScreen;
