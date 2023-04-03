import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet, ScrollView, ActivityIndicator, View, Text, Pressable
} from 'react-native';
import PropTypes from 'prop-types';
import Parse from 'parse/react-native.js';
import CustomInput from '../components/customInput.js';

const SignupScreen = (props) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [email, setEmail] = useState();
  const navigation = useNavigation();

  const signupUser = async function () {
        const user = new Parse.User();
        user.setUsername(username);
        user.setPassword(password);
        user.setEmail(email);
        try {
          await user.signUp();
        } catch (error) {
          alert("Error: " + error.message);
          return;
        }
        navigation.navigate("Home");
      }

  return (
    <View style={styles.page}>
        <View>
        <Text>Username</Text>
          <CustomInput
          keyboardType="email-address"
          placeholder="Username"
          returnKeyType="next"
          onChangeText={(userEmail) => setUsername(userEmail)}
          value={username}
          />
          <Text>Password</Text>
        <CustomInput
          placeholder="******"
          secureTextEntry
          onChangeText={(e) => setPassword(e)}
          value={password}
          />
          <Text>E-mail</Text>
        <CustomInput
          placeholder="abc@gmail.com"
          returnKeyType="next"
          onChangeText={(e) => setEmail(e)}
          value={email}
        />
            <Pressable style={styles.button} onPress={signupUser} variant="primary" type="submit">
              <Text style={styles.text}>Create account</Text>
            </Pressable>
        </View>
    </View>
  );
}


const styles = StyleSheet.create({
  page: {
    padding: 30,
    height: '100%',
    backgroundColor: '#F9F5FF'
  },
  button: {
    backgroundColor: '#F06543',
    width: 220,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 24,
  },
  text: {
    color: 'white',
    fontFamily: 'Archivo_Black',
    fontSize: 18,
    textAlign: 'center'
  },
});

export default SignupScreen;
