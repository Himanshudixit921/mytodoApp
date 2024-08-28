import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import SignupPage from './compoent/SignUpPage';
import LoginPage from './compoent/LoginPage';
import ToDoListPage from './compoent/ToDoPage';
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Signup">
        <Stack.Screen name="Signup" component={SignupPage} />
        <Stack.Screen name="Login" component={LoginPage} />
        <Stack.Screen name="ToDoList" component={ToDoListPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
