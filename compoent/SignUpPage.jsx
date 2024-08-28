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

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({title: '', message: ''});

  const navigation = useNavigation();

  const handleSignup = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      setModalData({
        title: 'Validation Error',
        message: 'All fields are required.',
      });
      setModalVisible(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setModalData({
        title: 'Validation Error',
        message: 'Please enter a valid email address.',
      });
      setModalVisible(true);
      return;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password.trim())) {
      setModalData({
        title: 'Validation Error',
        message:
          'Password must be at least 8 characters long and contain both letters and numbers.',
      });
      setModalVisible(true);
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem('authData');
      console.log('Existing Data:', existingData);

      const parsedData = existingData ? JSON.parse(existingData) : [];
      console.log('Parsed Data:', parsedData);

      const emailExists = parsedData.some(user => user.email === email.trim());
      if (emailExists) {
        setModalData({
          title: 'Registration Error',
          message: 'Email already registered. Please use a different email.',
        });
        setModalVisible(true);
        return;
      }

      const usernameExists = parsedData.some(
        user => user.username === username.trim(),
      );
      if (usernameExists) {
        setModalData({
          title: 'Registration Error',
          message:
            'Username already taken. Please choose a different username.',
        });
        setModalVisible(true);
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        username: username.trim(),
        email: email.trim(),
        password: password.trim(),
      };

      parsedData.push(newUser);

      await AsyncStorage.setItem('authData', JSON.stringify(parsedData));
      console.log('Data after save:', parsedData);

      setModalData({
        title: 'Success',
        message: 'User registered successfully!',
      });
      setModalVisible(true);

      setUsername('');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        setModalVisible(false);
        navigation.navigate('ToDoList', {userId: newUser.id});
      }, 1500);
    } catch (error) {
      console.error('Signup Error:', error);
      setModalData({
        title: 'Error',
        message: 'An unexpected error occurred. Please try again later.',
      });
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Signup</Text>

      <TextInput
        style={[styles.input, {color: 'black'}]}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

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

      <Button title="Sign Up" onPress={handleSignup} color="#1E90FF" />

      <TouchableOpacity
        style={styles.switchAuthContainer}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchAuthText}>
          Already have an account? <Text style={styles.linkText}>Login</Text>
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

export default SignupPage;
