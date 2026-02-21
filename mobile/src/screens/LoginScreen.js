import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { sendOtp } from '../api/client';
import RecaptchaVerifier from '../components/RecaptchaVerifier';

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState('+91');
  const [loading, setLoading] = useState(false);
  const [showRecaptcha, setShowRecaptcha] = useState(false);

  const handleSendOtp = () => {
    const trimmed = phone.trim();
    if (!trimmed || trimmed.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }
    setShowRecaptcha(true);
  };

  const onRecaptchaVerify = async (recaptchaToken) => {
    setShowRecaptcha(false);
    setLoading(true);
    try {
      const data = await sendOtp(phone.trim(), recaptchaToken);
      navigation.navigate('OTP', {
        phoneNumber: phone.trim(),
        sessionInfo: data.sessionInfo,
      });
    } catch (err) {
      Alert.alert('Failed to Send OTP', err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const onRecaptchaError = (message) => {
    setShowRecaptcha(false);
    Alert.alert('Verification Failed', message || 'reCAPTCHA verification failed');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={styles.logo}>📱</Text>
        <Text style={styles.title}>Status</Text>
        <Text style={styles.subtitle}>Share your daily status updates</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="+91 9876543210"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
          autoFocus
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSendOtp}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Send OTP</Text>
          )}
        </TouchableOpacity>
      </View>

      <RecaptchaVerifier
        visible={showRecaptcha}
        onVerify={onRecaptchaVerify}
        onError={onRecaptchaError}
        onClose={() => setShowRecaptcha(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F3FF',
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6C63FF',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 6,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
  },
  button: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
