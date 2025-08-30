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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const ProblemDescriptionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { problem } = route.params as { problem: any };

  const [description, setDescription] = useState('');
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [videoRecorded, setVideoRecorded] = useState(false);

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoCaptured(true);
    }
  };

  const handleRecordVideo = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to record videos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      videoMaxDuration: 15,
    });

    if (!result.canceled) {
      setVideoRecorded(true);
    }
  };

  const handleContinue = () => {
    if (description.trim()) {
      navigation.navigate('MobileVerification' as never, { 
        problem,
        description: description.trim(),
        hasPhoto: photoCaptured,
        hasVideo: videoRecorded
      } as never);
    } else {
      Alert.alert('Description Required', 'Please describe your problem to continue');
    }
  };

  const isContinueEnabled = description.trim().length > 0;

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
          <Text style={styles.headerTitle}>Describe the Problem</Text>
          <Text style={styles.headerSubtitle}>Help us understand what's wrong with your vehicle</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Problem Description */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Problem Description*</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Please describe your problem in detail..."
            placeholderTextColor={COLORS.textLight}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Add Photos or Video */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Add Photos or Video (Optional)</Text>
          
          <TouchableOpacity 
            style={[
              styles.mediaButton,
              photoCaptured && styles.mediaButtonCaptured
            ]}
            onPress={handleTakePhoto}
          >
            <Ionicons 
              name={photoCaptured ? "checkmark-circle" : "camera"} 
              size={24} 
              color={photoCaptured ? COLORS.accent : COLORS.textLight} 
            />
            <Text style={[
              styles.mediaButtonText,
              photoCaptured && styles.mediaButtonTextCaptured
            ]}>
              {photoCaptured ? 'Photo Captured' : 'Click a Picture'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.mediaButton,
              videoRecorded && styles.mediaButtonCaptured
            ]}
            onPress={handleRecordVideo}
          >
            <Ionicons 
              name={videoRecorded ? "checkmark-circle" : "videocam"} 
              size={24} 
              color={videoRecorded ? COLORS.accent : COLORS.textLight} 
            />
            <Text style={[
              styles.mediaButtonText,
              videoRecorded && styles.mediaButtonTextCaptured
            ]}>
              {videoRecorded ? 'Video Recorded' : 'Record Video (15s)'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[
            styles.continueButton,
            isContinueEnabled && styles.continueButtonEnabled
          ]}
          onPress={handleContinue}
          disabled={!isContinueEnabled}
        >
          <Text style={[
            styles.continueButtonText,
            isContinueEnabled && styles.continueButtonTextEnabled
          ]}>
            Continue
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={20} 
            color={isContinueEnabled ? COLORS.white : COLORS.textLight} 
          />
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 120,
  },
  mediaButton: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mediaButtonCaptured: {
    backgroundColor: '#E8F5E8',
    borderColor: COLORS.accent,
  },
  mediaButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: COLORS.textLight,
  },
  mediaButtonTextCaptured: {
    color: COLORS.accent,
    fontWeight: '500',
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  continueButton: {
    backgroundColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonEnabled: {
    backgroundColor: COLORS.primary,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginRight: 8,
  },
  continueButtonTextEnabled: {
    color: COLORS.white,
  },
});

export default ProblemDescriptionScreen;
