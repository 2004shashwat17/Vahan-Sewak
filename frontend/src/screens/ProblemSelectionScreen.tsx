import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { PROBLEM_TYPES } from '../constants/data';
import { useNavigation } from '@react-navigation/native';
import { ProblemType } from '../types';

const ProblemSelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedProblem, setSelectedProblem] = useState<ProblemType | null>(null);

  const handleProblemSelect = (problem: ProblemType) => {
    setSelectedProblem(problem);
  };

  const handleContinue = () => {
    if (selectedProblem) {
      if (selectedProblem.id === 'other') {
        // For "Other / Not Sure", go to problem description
        navigation.navigate('ProblemDescription' as never, { problem: selectedProblem } as never);
      } else {
        // For normal problems, go directly to mobile verification
        navigation.navigate('MobileVerification' as never, { 
          problem: selectedProblem,
          description: selectedProblem.description,
          hasPhoto: false,
          hasVideo: false
        } as never);
      }
    }
  };

  const renderProblemItem = ({ item }: { item: ProblemType }) => {
    const isSelected = selectedProblem?.id === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.problemCard,
          isSelected && styles.selectedCard
        ]}
        onPress={() => handleProblemSelect(item)}
      >
        <View style={styles.iconContainer}>
          <Ionicons 
            name={item.icon as any} 
            size={32} 
            color={isSelected ? COLORS.white : COLORS.textLight} 
          />
        </View>
        <Text style={[
          styles.problemText,
          isSelected && styles.selectedText
        ]}>
          {item.name}
        </Text>
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
          <Text style={styles.headerTitle}>What's the problem?</Text>
          <Text style={styles.headerSubtitle}>Select the issue you're experiencing</Text>
        </View>
      </View>

      {/* Problem Grid */}
      <View style={styles.content}>
        <FlatList
          data={PROBLEM_TYPES}
          renderItem={renderProblemItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
        />
      </View>

      {/* Continue Button */}
      {selectedProblem && (
        <View style={styles.continueContainer}>
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Can't find your problem? Select "Other / Not Sure" to describe it
        </Text>
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
  gridContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  problemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    width: '48%',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCard: {
    backgroundColor: COLORS.primary,
  },
  iconContainer: {
    marginBottom: 12,
  },
  problemText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
    textAlign: 'center',
  },
  selectedText: {
    color: COLORS.white,
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  continueContainer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginRight: 8,
  },
});

export default ProblemSelectionScreen;
