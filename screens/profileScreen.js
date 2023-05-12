import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet, ScrollView, TouchableOpacity, View, Text, Pressable
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
function ProfileScreen(props) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [userLogged, setUser] = useState(checkUser);
  const navigation = useNavigation();


  const logOut = () => {
    addEvent('logout').then(() => {
        Parse.User.logOut().then(() => {
          navigation.navigate("Home", {logOut: true});
          props.onLogOut()
        })
      })
    }
    content = (
    <View style={styles.container}>
      <Text style={styles.profileText}>Hi {Parse.User.current().get('username')}</Text>
      <TouchableOpacity style={styles.button} onPress={logOut} variant="primary" type="submit">
        <Text style={styles.text}>Sign out</Text>
      </TouchableOpacity>
    </View>
    )
    return content
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F9F5FF',
    padding:20
  },
  button: {
    backgroundColor: '#F06543',
    width: 180,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 24,
    margin: 15
  },
  text: {
    color: 'white',
    fontFamily: 'Archivo_Black',
    fontSize: 18,
    textAlign: 'center'
  },
  profileText: {
    textAlign: 'center',
    fontSize: 30,
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

export default ProfileScreen;
