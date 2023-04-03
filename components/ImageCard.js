import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, StyleSheet
  } from 'react-native';
export default function ImageCard({ imageId, url, words }) {
   const [showValue, setShowValue] = useState();
  return (
      <View  style={styles.mainContainer}>
          {words.map((e) => (
            <View style={styles.container}
            key={e.id}>
              <Image style={styles.image} source={{uri: url}}></Image>
              <View style={{display: 'flex', flexDirection:'columns', justifyContent: 'space-around'}}>
                <Text style={{margin: 10, fontSize: 18}}>{e.get("from")}</Text>
                <Text style={{margin: 10, fontSize: 16, opacity: 0.8}}>{e.get("to")}</Text>
              </View>
              {showValue&& <Text>{e.get("to")}</Text>}
            </View>
          ))}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: true,
      width: '90%',
      alignSelf: 'center',
      backgroundColor: 'rgba(168, 168, 237, 0.3)',
      marginBottom: 10,
      borderRadius: 10
  },
  mainContainer: {
      width: '100%',
      textAlign: 'center',
      fontWeight: 600,
      fontFamily: 'Archivo',
  },
  image: {
    height: 60,
    width: 60,
    margin: 10,
    alignSelf: 'center',
    justifyContent: 'center'
  },
});
