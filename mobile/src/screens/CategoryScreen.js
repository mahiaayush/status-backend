import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryStatuses } from '../api/client';

export default function CategoryScreen({ route }) {
  const { type } = route.params;
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatuses = useCallback(async () => {
    try {
      const data = await getCategoryStatuses(type);
      setStatuses(data || []);
    } catch {
      setStatuses([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [type]);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStatuses();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
      ) : (
        <View style={styles.cardImagePlaceholder}>
          <Ionicons name="image-outline" size={32} color="#C4C0FF" />
        </View>
      )}
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={statuses.length === 0 ? styles.emptyContainer : styles.list}
      data={statuses}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C63FF" />}
      ListEmptyComponent={
        <View style={styles.empty}>
          <Ionicons name="albums-outline" size={48} color="#C4C0FF" />
          <Text style={styles.emptyText}>No statuses found</Text>
          <Text style={styles.emptySubtext}>Nothing in {type} yet</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  list: {
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardImage: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
  },
  cardImagePlaceholder: {
    width: 90,
    height: 90,
    backgroundColor: '#F0EFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    flex: 1,
    padding: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
  },
  empty: {
    alignItems: 'center',
    padding: 40,
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
});
