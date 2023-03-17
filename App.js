import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import mainScreen from './screens/mainScreen'
import LearnScreen from './screens/learnScreen'
import TranslationScreen from './screens/translationScreen'
import LoginScreen from './screens/loginScreen'
import SignupScreen from './screens/signupScreen'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { initializeParse } from '@parse/react-native';

initializeParse(
  "https://parseapi.back4app.com/",
  "KLxcuhhjrb2JQwegqs5jto882HLxv7scW89HDACX",
  "hfYT45KTgwRr4JBWGQFaCSokz7URgAPiyoTRlqxT"
);

export default function App() {
  // const [varx, setVarx] = useState('');
  let x = 'sth';

  const changeX = () => {
    console.log('hihi')
    x = 'hehe'
  }
  const Tab = createBottomTabNavigator();
  const User = createStackNavigator();

  function UserScreen() {
    return (
      <User.Navigator>
        <User.Screen name="Login" component={LoginScreen} />
        <User.Screen name="Signup" component={SignupScreen} />
      </User.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Button onPress={changeX} title={x}>
        </Button>
        <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Home') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'Library') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name === 'Translations') {
              iconName = focused ? 'language' : 'language-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'log-in' : 'log-in-outline';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Home" component={mainScreen}  />
        <Tab.Screen name="Library" component={LearnScreen} />
        <Tab.Screen name="Translations" component={TranslationScreen} />
        <Tab.Screen
        name="Profile"
        component={UserScreen}
      />
      </Tab.Navigator>
      <StatusBar style="auto" />
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
