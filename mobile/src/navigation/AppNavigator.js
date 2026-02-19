import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import OTPScreen from '../screens/OTPScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoryScreen from '../screens/CategoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const AuthStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="OTP" component={OTPScreen} />
    </AuthStack.Navigator>
  );
}

function HomeNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#333',
        headerTitleStyle: { fontWeight: '600' },
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ title: 'Status' }} />
      <HomeStack.Screen
        name="Category"
        component={CategoryScreen}
        options={({ route }) => ({
          title: route.params.type.charAt(0).toUpperCase() + route.params.type.slice(1),
        })}
      />
    </HomeStack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { backgroundColor: '#fff', borderTopColor: '#F0F0F0' },
        tabBarIcon: ({ color, size }) => {
          const iconName = route.name === 'HomeTab' ? 'home' : 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="HomeTab" component={HomeNavigator} options={{ title: 'Home' }} />
      <Tabs.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: true,
          headerStyle: { backgroundColor: '#fff' },
          headerTintColor: '#333',
          headerTitleStyle: { fontWeight: '600' },
        }}
      />
    </Tabs.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainTabs /> : <AuthNavigator />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
  },
});
