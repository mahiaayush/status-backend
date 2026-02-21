import React from 'react';
import { Modal, View, StyleSheet, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { FIREBASE_CONFIG } from '../config';

const getRecaptchaHtml = () => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: #F5F3FF;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .loading { color: #6C63FF; font-size: 16px; }
    .error { color: #e74c3c; font-size: 14px; text-align: center; padding: 20px; }
  </style>
</head>
<body>
  <div id="recaptcha-container"></div>
  <p class="loading" id="status">Verifying...</p>

  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
  <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
  <script>
    try {
      firebase.initializeApp({
        apiKey: '${FIREBASE_CONFIG.apiKey}',
        authDomain: '${FIREBASE_CONFIG.authDomain}',
      });

      const verifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: function(token) {
          document.getElementById('status').textContent = 'Verified!';
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'success', token: token }));
        },
        'expired-callback': function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: 'reCAPTCHA expired. Please try again.' }));
        }
      });

      verifier.verify().catch(function(err) {
        document.getElementById('status').textContent = 'Verification failed';
        document.getElementById('status').className = 'error';
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: err.message || 'reCAPTCHA verification failed' }));
      });
    } catch(err) {
      document.getElementById('status').textContent = 'Error: ' + err.message;
      document.getElementById('status').className = 'error';
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: err.message }));
    }
  </script>
</body>
</html>
`;

export default function RecaptchaVerifier({ visible, onVerify, onError, onClose }) {
  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'success') {
        onVerify(data.token);
      } else if (data.type === 'error') {
        onError(data.message);
      }
    } catch {
      onError('Failed to parse reCAPTCHA response');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Verifying</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.webviewContainer}>
            <WebView
              source={{ html: getRecaptchaHtml() }}
              onMessage={handleMessage}
              javaScriptEnabled
              domStorageEnabled
              originWhitelist={['*']}
              style={styles.webview}
            />
            <ActivityIndicator style={styles.spinner} size="large" color="#6C63FF" />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#999',
  },
  webviewContainer: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: '#F5F3FF',
  },
  spinner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
