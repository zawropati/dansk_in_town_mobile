import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, StyleSheet
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
                <View style={{display: 'flex', flexDirection:'columns'}}>
                    <Text style={{margin: 10, fontSize: 18}}>{e.get("from")}</Text>
                  {seeTranslations && (
                    <Text style={{margin: 10, fontSize: 16, opacity: 0.8}}>{e.get("to")}</Text>
                  )}
                </View>
              </View>
              <Text style={{margin: 10, fontSize: 14, opacity: 0.8, alignSelf: 'flex-end'}}>{ Moment(e.get("createdAt")).format('DD/MM/YY')} </Text>
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
    backgroundColor: 'rgba(168, 168, 237, 0.3)',
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: 'space-between'
  },
  mainContainer: {
    width: '100%',
    textAlign: 'center',
    fontWeight: 600,
    fontFamily: 'Archivo',
    alignSelf: ''
  },
  image: {
    height: 80,
    width: 80,
    margin: 10,
    alignSelf: 'center',
    justifyContent: 'center'
  },
});
