import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { SAMPLE_SERVICE_HISTORY } from '../constants/data';

const ServiceHistoryScreen = () => {
  const renderServiceItem = ({ item }: { item: any }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceType}>{item.problemType}</Text>
        <View style={styles.statusTag}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.serviceDetails}>
        <Text style={styles.mechanicText}>Mechanic: {item.mechanic}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      
      <View style={styles.costContainer}>
        <Text style={styles.costText}>₹{item.cost}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Service History</Text>
      </View>

      {/* Service List */}
      <View style={styles.content}>
        <FlatList
          data={SAMPLE_SERVICE_HISTORY}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.serviceList}
        />
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  serviceList: {
    paddingBottom: 20,
  },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statusTag: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  serviceDetails: {
    marginBottom: 12,
  },
  mechanicText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  costContainer: {
    alignItems: 'flex-end',
  },
  costText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
});

export default ServiceHistoryScreen;
