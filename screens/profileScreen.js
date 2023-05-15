import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet, TouchableOpacity, View, Text, Pressable
} from 'react-native';
import Parse from 'parse/react-native.js';
import { User } from 'parse/react-native.js';
import {addEvent} from '../calls/db'
import Moment from 'moment';

function ProfileScreen(props) {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [date, setDate] = useState();
  const navigation = useNavigation();
  // setDate(Parse.User.current().get('createdAt'))

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
      <Text style={styles.profileText}>Hi {Parse.User.current().get("username")}!</Text>
      <Text style={styles.profileTextSmall}>Joined: {Moment(Parse.User.current().get("createdAt")).format('DD/MM/YY')}</Text>
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
    backgroundColor: '#FFFDFB',
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
  profileTextSmall: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 10
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
