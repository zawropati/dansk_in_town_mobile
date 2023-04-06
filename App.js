import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
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
import { useFonts } from 'expo-font';
import Parse from 'parse/react-native.js';
import { addEvent } from './calls/db';

initializeParse(
  "https://parseapi.back4app.com/",
  "KLxcuhhjrb2JQwegqs5jto882HLxv7scW89HDACX",
  "hfYT45KTgwRr4JBWGQFaCSokz7URgAPiyoTRlqxT"
);

export default function App() {
  const Tab = createBottomTabNavigator();
  const User = createStackNavigator();
  const [loggedInUser, setLoggedInUser] = useState(false)

  useEffect(() => {
    const checkForUser = async () => {
      await Parse.User.currentAsync().then((result) => {
        if(result){
          setLoggedInUser(true)
        }else{
          setLoggedInUser(false)
        }
      })
    }
    checkForUser();
  }, [loggedInUser]);

  const [fontsLoaded] = useFonts({
    'Archivo_Black': require('./assets/ArchivoBlack-Regular.ttf'),
    'Archivo': require('./assets/Archivo-Regular.ttf'),
  });


  function UserScreen() {
    return (
      <User.Navigator screenOptions={{ tabBarShowLabel: false}}  >
        <User.Screen options={{ headerStyle: { backgroundColor: '#FFFDFB'}}} name="Login">
        {(props) => <LoginScreen {...props} onLogIn={() => setLoggedInUser(true) } onLogOut={() => setLoggedInUser(false)} />}
        </User.Screen>
        <User.Screen options={{ headerStyle: { backgroundColor: '#FFFDFB'}}} name="Signup" component={SignupScreen} />
      </User.Navigator>
    );
  }

  if (!fontsLoaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'camera' : 'camera-outline';
            iconColor = focused ?  '#FFFDFB' :  '#F06543'
          } else if (route.name === 'Library') {
            iconName = focused ? 'book' : 'book-outline';
            iconColor = focused ?  '#FFFDFB' :  '#F06543'
          } else if (route.name === 'Practice') {
            iconName = focused ? 'language' : 'language-outline';
            iconColor = focused ?  '#FFFDFB' :  '#F06543'
          } else if (route.name === 'Profile') {
            iconName = focused ? 'log-in' : 'log-in-outline';
            iconColor = focused ?  '#FFFDFB' :  '#F06543'
          }else {
            iconName = focused ? 'log-in' : 'log-in-outline';
            iconColor = focused ?  '#FFFDFB' :  '#F06543'
          }
          return <Ionicons name={iconName} size={size} color={iconColor} />;
        },
        tabBarActiveBackgroundColor: '#F06543',
        tabBarActiveTintColor: "#FFFDFB",
        tabBarInactiveTintColor: "black",
        tabBarStyle: [{ backgroundColor: '#FFF8F1', borderTopWidth: 0, marginRight: 5 }],
      })}
    >
    {loggedInUser ? (
      <><Tab.Screen options={{ headerStyle: { backgroundColor: '#FFFDFB'}, headerShadowVisible: false }} name="Home" component={mainScreen} />
      <Tab.Screen options={{ headerStyle: { backgroundColor: '#FFFDFB' }, headerShadowVisible: false  }} name="Library" component={LearnScreen} />
      <Tab.Screen options={{ headerStyle: { backgroundColor: '#FFFDFB' }, headerShadowVisible: false  }} name="Practice" component={TranslationScreen} />
      <Tab.Screen
      name="Log out"
      component={LoginScreen}
      listeners={({ navigation }) => ({
        tabPress: (e) => {
          addEvent('logout').then(() => {
            e.preventDefault();
            Parse.User.logOut().then(() => {
              setLoggedInUser(false)
              navigation.navigate("Home", {logOut: true});
            })
          })
        }
      })}
      />
    </>
    ) : (
      <><Tab.Screen options={{ headerStyle: { backgroundColor: '#FFFDFB' } }} name="Home" component={mainScreen} />
      <Tab.Screen options={{ headerStyle: { backgroundColor: '#FFFDFB' } }}
      name="Profile"
      component={UserScreen} />
      </>
    )}
      </Tab.Navigator>
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
