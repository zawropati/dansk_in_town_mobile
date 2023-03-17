import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet, ScrollView, ActivityIndicator, View, Text, Pressable
} from 'react-native';
import PropTypes from 'prop-types';
import something from '../calls/imagesApi.js'
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
    marginTop: '10%',
  },
  button: {
    backgroundColor: '#F75835',
    width: 200,
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  }

});

export default SignupScreen;
