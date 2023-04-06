import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet, ScrollView, ActivityIndicator, View, Text, Pressable
} from 'react-native';
import Parse from 'parse/react-native.js';
import CustomInput from '../components/customInput.js';
import { User } from 'parse/react-native.js';
import {addEvent} from '../calls/db'

const checkUser = async () => {
  if(await User.currentAsync()){
    return true
  }else{
    return false
  }
}
function LoginScreen(props) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [userLogged, setUser] = useState(checkUser);
  const navigation = useNavigation();

  const doUserLogIn = () => {
    const user = new Parse.User();
    user.setPassword(password);
    user.setUsername(username);
    user.logIn().then((loggedInUser) => {
      addEvent('login')
      navigation.navigate("Home");
      props.onLogIn()
      setUser(true)
    }).catch((error) => {
      console.log(error.message)
      return false;
    });
  }

  const goToSignup = function () {
    navigation.navigate("Signup");
  }

  const logOut = () => {
    Parse.User.logOut().then(() => {
      props.onLogOut()
      setUser(false)
      console.log(User.currentAsync())
      navigation.navigate("Home");
      })
  }

    content = (
      <View style={styles.page}>
      {/* {(!userLogged) && ( */}
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
          <Text >Don't have an account?</Text>
          <Pressable style={styles.signup} onPress={goToSignup} variant="primary" type="submit">
            <Text style={styles.link}> Create one!</Text>
          </Pressable>
        </View></>
        {/* )} */}
    {/* {userLogged && (
      <>
      <Text>Hi {Parse.User.current().get('username')}</Text>
      <Pressable style={styles.button} onPress={logOut} variant="primary" type="submit">
        <Text style={styles.text}>Sign out</Text>
      </Pressable></>
    )} */}
    </View>
    )
    return content
}


const styles = StyleSheet.create({
  page: {
    padding: 30,
    height: '100%',
    backgroundColor: '#F06543'
  },
  button: {
    backgroundColor: '#F06543',
    width: 180,
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
