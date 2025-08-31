import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function MerchantScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome back!
Rajesh Kumar</Text>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Status</Text>
        <View style={styles.statusBox}>
          <Text style={styles.onlineText}>ONLINE</Text>
          <Text style={styles.readyText}>Ready to receive jobs</Text>
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statBox}><Text style={styles.statValue}>₹2,450</Text><Text style={styles.statLabel}>Today's Earnings</Text></View>
        <View style={styles.statBox}><Text style={styles.statValue}>4.8</Text><Text style={styles.statLabel}>Rating</Text></View>
        <View style={styles.statBox}><Text style={styles.statValue}>127</Text><Text style={styles.statLabel}>Total Jobs</Text></View>
        <View style={styles.statBox}><Text style={styles.statValue}>₹15,620</Text><Text style={styles.statLabel}>This Week</Text></View>
      </View>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}><Text style={styles.actionText}>Navigate to Job</Text></TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}><Text style={styles.actionText}>Update Location</Text></TouchableOpacity>
      </View>
      <View style={styles.currentJobBox}>
        <Text style={styles.currentJobTitle}>Current Job</Text>
        <Text style={styles.currentJobDesc}>Engine Repair • 2.3 km away{"\n"}Customer: Amit Sharma</Text>
        <TouchableOpacity style={styles.continueButton}><Text style={styles.continueText}>Continue Job</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#263A4A', marginBottom: 12 },
  statusContainer: { marginBottom: 16 },
  statusText: { fontSize: 16, color: '#263A4A', marginBottom: 4 },
  statusBox: { backgroundColor: '#EAF7F0', borderRadius: 12, padding: 12 },
  onlineText: { fontSize: 18, fontWeight: 'bold', color: '#1DB954' },
  readyText: { fontSize: 14, color: '#263A4A' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statBox: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#263A4A' },
  statLabel: { fontSize: 12, color: '#263A4A' },
  quickActions: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  actionButton: { backgroundColor: '#FF6B2C', borderRadius: 8, padding: 10, flex: 1, marginHorizontal: 4 },
  actionText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  currentJobBox: { backgroundColor: '#FFF6E9', borderRadius: 12, padding: 16 },
  currentJobTitle: { fontSize: 16, fontWeight: 'bold', color: '#263A4A', marginBottom: 4 },
  currentJobDesc: { fontSize: 14, color: '#263A4A', marginBottom: 8 },
  continueButton: { backgroundColor: '#FF6B2C', borderRadius: 8, padding: 10 },
  continueText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
});
