// LoginPage.jsx

import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import MessageModal from './MessageModal';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({title: '', message: ''});

  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setModalData({
        title: 'Validation Error',
        message: 'All fields are required.',
      });
      setModalVisible(true);
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem('authData');
      const parsedData = existingData ? JSON.parse(existingData) : [];

      const user = parsedData.find(
        user =>
          user.email === email.trim() && user.password === password.trim(),
      );

      if (user) {
        setModalData({
          title: 'Success',
          message: 'Login successful!',
        });
        setModalVisible(true);
        setEmail('');
        setPassword('');
        setTimeout(() => {
          setModalVisible(false);
          navigation.navigate('ToDoList', {userId: user.id});
        }, 1500);
      } else {
        setModalData({
          title: 'Login Error',
          message: 'Invalid email or password.',
        });
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Login Error:', error);
      setModalData({
        title: 'Error',
        message: 'An unexpected error occurred. Please try again later.',
      });
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>

      <TextInput
        style={[styles.input, {color: 'black'}]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, {color: 'black'}]}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button title="Login" onPress={handleLogin} color="#1E90FF" />

      <TouchableOpacity
        style={styles.switchAuthContainer}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.switchAuthText}>
          Don't have an account? <Text style={styles.linkText}>Sign Up</Text>
        </Text>
      </TouchableOpacity>

      <MessageModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalData.title}
        message={modalData.message}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 32,
    marginBottom: 30,
    textAlign: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  switchAuthContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchAuthText: {
    fontSize: 16,
    color: '#555',
  },
  linkText: {
    color: '#1E90FF',
    fontWeight: 'bold',
  },
});

export default LoginPage;
