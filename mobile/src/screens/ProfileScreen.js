import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.avatarSection}>
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={48} color="#6C63FF" />
        </View>
        <Text style={styles.name}>{user?.name || 'User'}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Ionicons name="briefcase-outline" size={20} color="#6C63FF" />
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Occupation</Text>
            <Text style={styles.rowValue}>{user?.occupation || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="location-outline" size={20} color="#6C63FF" />
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Address</Text>
            <Text style={styles.rowValue}>{user?.address || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={20} color="#6C63FF" />
          <View style={styles.rowContent}>
            <Text style={styles.rowLabel}>Joined</Text>
            <Text style={styles.rowValue}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        activeOpacity={0.8}
        onPress={() => Alert.alert('Coming Soon', 'Edit profile will be available soon!')}
      >
        <Ionicons name="create-outline" size={18} color="#6C63FF" />
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        activeOpacity={0.8}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={18} color="#FF4D4D" />
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 12,
  },
  avatarCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8E6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rowContent: {
    marginLeft: 14,
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 6,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E8E6FF',
  },
  editButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6C63FF',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF0F0',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FFE0E0',
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FF4D4D',
  },
});
