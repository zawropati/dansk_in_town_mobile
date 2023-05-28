import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, StyleSheet, TouchableOpacity
  } from 'react-native';
import Moment from 'moment';

export default function ImageCard({ imageId, url, words, seeTranslations }) {
  return (
      <View style={styles.mainContainer}>
          {words.map((e) => (
            <View style={styles.container}
            key={e.id}>
              <View style={{display: 'flex', flexDirection:'row', alignSelf: 'center'}}>
                <Image style={styles.image} source={{uri: url}}></Image>
                <View style={{display: 'flex', flexDirection:'column', flexShrink: 1}}>
                    <Text style={{margin: 10, fontSize: 18, }}>{e.get("from")}</Text>
                  {seeTranslations && (
                    <Text style={{margin: 10, fontSize: 16, opacity: 0.8}}>{e.get("to")}</Text>
                    )}
                </View>
              </View>
              {/* <TouchableOpacity style={styles.delete}><Text style={{color: 'white'}}>Delete</Text></TouchableOpacity> */}
              <Text style={{margin: 10, fontSize: 14, opacity: 0.8, position:'absolute', right: 0, bottom: 0}}>{ Moment(e.get("createdAt")).format('DD/MM/YY')} </Text>
            </View>
          ))}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    // backgroundColor: '#FFF8F1',
    borderBottomColor: '#4845ed',
    borderBottomWidth: 1,
    borderStyle: 'solid',
    justifyContent: 'space-between'
  },
  mainContainer: {
    width: '100%',
    textAlign: 'center',
    fontWeight: 600,
    fontFamily: 'Archivo',
  },
  image: {
    height: 70,
    width: 70,
    margin: 10,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  delete: {
    margin: 10,
    backgroundColor:'#F06543',
    position:'absolute',
    right: 0,
    top: 0,
    padding: 5,
    borderRadius: 7
  }
});
