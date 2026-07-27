import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { apiClient } from '../services/apiClient';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);

      if (!email || !password) {
        setError('Vyplň email a heslo');
        setLoading(false);
        return;
      }

      const response = await apiClient.login(email, password);
      Alert.alert('✅ Úspěch', `Vítej, ${response.user.firstName}!`);
      onLoginSuccess(response.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Přihlášení selhalo');
      Alert.alert('❌ Chyba', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setError('');
      setLoading(true);

      if (!email || !password || !firstName) {
        setError('Vyplň všechna povinná pole');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Heslo musí mít alespoň 6 znaků');
        setLoading(false);
        return;
      }

      const response = await apiClient.register(email, password, firstName, lastName);
      Alert.alert('✅ Úspěch', 'Účet byl vytvořen! Vítej v SMAD PACK!');
      onLoginSuccess(response.user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registrace selhala');
      Alert.alert('❌ Chyba', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📦 SMAD PACK</Text>
        <Text style={styles.subtitle}>Odhaduj ceny věcí snadno</Text>
      </View>

      <View style={styles.form}>
        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="tvuj@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />

        {/* Password */}
        <Text style={styles.label}>Heslo</Text>
        <TextInput
          style={styles.input}
          placeholder="Tvoje heslo"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          editable={!loading}
        />

        {/* Register fields */}
        {!isLogin && (
          <>
            <Text style={styles.label}>Jméno *</Text>
            <TextInput
              style={styles.input}
              placeholder="Tvoje jméno"
              value={firstName}
              onChangeText={setFirstName}
              editable={!loading}
            />

            <Text style={styles.label}>Příjmení</Text>
            <TextInput
              style={styles.input}
              placeholder="Tvoje příjmení"
              value={lastName}
              onChangeText={setLastName}
              editable={!loading}
            />
          </>
        )}

        {/* Error message */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Submit button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={isLogin ? handleLogin : handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? '🔓 Přihlásit se' : '✍️ Zaregistrovat se'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Toggle between login and register */}
        <TouchableOpacity
          onPress={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          disabled={loading}
        >
          <Text style={styles.toggleText}>
            {isLogin ? 'Nemáš účet? Registruj se' : 'Už máš účet? Přihlas se'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>🚀 Připraven odhadovat?</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#333',
  },
  error: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});
