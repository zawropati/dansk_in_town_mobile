import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet, ScrollView, ActivityIndicator, View, Text, Pressable
} from 'react-native';
import PropTypes from 'prop-types';
import something from '../calls/imagesApi.js'
import Parse from 'parse/react-native.js';
import CustomInput from '../components/customInput.js';
import { User } from 'parse/react-native.js';

const LoginScreen = (props) => {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [loggedUser, setUser] = useState();
  const navigation = useNavigation();
  // useEffect(() => {
  //   const loggedIn = function () {
  //     setUser(User.current())
  //   }
  //   }, [currentUser]);

  const doUserLogIn = async function () {
    const user = new Parse.User();
    user.setPassword(password);
    user.setUsername(username);
    user.logIn().then((loggedInUser) => {
        setUser(loggedInUser)
        navigation.navigate("Home");
      }).catch((error) => {
        console.log(error.message)
        // Error can be caused by wrong parameters or lack of Internet connection
        alert( error.message);
        return false;
      });

    // return await Parse.User.logIn(usernameValue, passwordValue)
    //   .then(async (loggedInUser) => {
    //     // logIn returns the corresponding ParseUser object
    //     // alert(
    //     //   'Success!',
    //     //   `User ${loggedInUser.get('username')} has successfully signed in!`,
    //     // );
    //     // To verify that this is in fact the current user, currentAsync can be used
    //     const currentUser = await Parse.User.currentAsync();
    //     setUser(currentUser)
    //     console.log(loggedInUser === currentUser);
    //     navigation.navigate("Home");
    //     return true;
    //   })
    //   .catch((error) => {
    //     console.log(error.message)
    //     // Error can be caused by wrong parameters or lack of Internet connection
    //     alert('Error!', error.message);
    //     return false;
      // });
  }

  const goToSignup = function () {
    navigation.navigate("Signup");
  }
  const logOut = function (e) {
      e.preventDefault();
      Parse.User.logOut().then(() => {
        setUser(null)
        navigation.navigate("Home");
      })
  }

    content = (
      <View style={styles.page}>
      {(!Parse.User.current()) && (
            <>
            <View>
              <Text>Username</Text>
              <CustomInput
                keyboardType="email-address"
                placeholder="E-mail"
                returnKeyType="next"
                onChangeText={(userEmail) => setUsername(userEmail)}
                value={username} />
              <Text>Password</Text>
              <CustomInput
                placeholder="******"
                secureTextEntry
                onChangeText={(e) => setPassword(e)}
                value={password} />
              <Pressable style={styles.button} onPress={doUserLogIn} variant="primary" type="submit">
                <Text style={styles.text}>Submit</Text>
              </Pressable>
            </View><View style={styles.signupBox}>
              <Text>Don't have an account?</Text>
              <Pressable style={styles.signup} onPress={goToSignup} variant="primary" type="submit">
                <Text style={styles.link}> Create one!</Text>
              </Pressable>
            </View></>)}
            {(Parse.User.current()) && (
              <>
              <Text>Hi {Parse.User.current().get('username')}</Text>
                <Pressable style={styles.button} onPress={logOut} variant="primary" type="submit">
                  <Text style={styles.text}>Sign out</Text>
                </Pressable></>
            )}
      </View>
    )
    return content

}


const styles = StyleSheet.create({
  page: {
    padding: 30,
    marginTop: '10%',
  },
  button: {
    backgroundColor: '#F75835',
    width: 150,
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center'
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline'
  },
  signupBox: {
    marginTop: 20,
    alignSelf: 'center',
    flexDirection:'row', flexWrap:'wrap'
  },

});

export default LoginScreen;
