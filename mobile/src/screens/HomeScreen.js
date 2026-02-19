import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTodayStatus } from '../api/client';

const CATEGORIES = ['religious', 'motivational', 'festival', 'birthday', 'anniversary'];

export default function HomeScreen({ navigation }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await getTodayStatus();
      setStatus(data);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStatus();
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C63FF" />}
    >
      <Text style={styles.sectionTitle}>Today's Status</Text>

      {status ? (
        <View style={styles.card}>
          {status.imageUrl ? (
            <Image source={{ uri: status.imageUrl }} style={styles.cardImage} />
          ) : (
            <View style={styles.cardImagePlaceholder}>
              <Ionicons name="image-outline" size={48} color="#C4C0FF" />
            </View>
          )}
          <View style={styles.cardBody}>
            <Text style={styles.cardTitle}>{status.title}</Text>
            <View style={styles.cardMeta}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{status.category}</Text>
              </View>
              {status.religionType ? (
                <Text style={styles.metaText}>{status.religionType}</Text>
              ) : null}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Ionicons name="calendar-outline" size={48} color="#C4C0FF" />
          <Text style={styles.emptyText}>No status for today</Text>
          <Text style={styles.emptySubtext}>Check back later!</Text>
        </View>
      )}

      <Text style={[styles.sectionTitle, { marginTop: 28 }]}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={styles.chip}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Category', { type: cat })}
          >
            <Text style={styles.chipText}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
            <Ionicons name="chevron-forward" size={14} color="#6C63FF" />
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginBottom: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardImagePlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#F0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#F0EFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6C63FF',
  },
  metaText: {
    fontSize: 12,
    color: '#888',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  chips: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: '#E8E6FF',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C63FF',
  },
});
