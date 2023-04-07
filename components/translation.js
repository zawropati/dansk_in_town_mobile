import {
    StyleSheet, View, Text, Button, TouchableOpacity, ActivityIndicator
  } from 'react-native';
import React, { useState } from 'react';
import CustomInput from '../components/customInput.js';

export default function Translation({translation, setFrom, setTo, deleteTranslation }) {
    const [isTranslated, setIsTranslated] = useState(false)
    const [result, setResult] = useState(false)
    const [loading, setLoading] = useState(false)

    async function automaticTranslation(e) {
        e.preventDefault();
        let word = await Parse.Cloud.run("google_translate", {
            word_to_translate: translation.from,
        });
        setResult(word)
        setIsTranslated(true)
    }
    async function saveAdd(){
        setLoading(true)
        translation.to = result
        setTo(translation, result);
    }


  return (
    <View style={styles.container}>
        <Text style={styles.label}>🇩🇰 Phrase from picture </Text>
        <CustomInput
            placeholder="Word to translate"
            onChangeText={(e) => setFrom(translation, e)}
            value={translation.from}
        />
        <TouchableOpacity style={styles.button} onPress={automaticTranslation}>
            <Text style={{color: '#fff', fontFamily: 'Archivo_Black'}}>
                Translate
            </Text>
        </TouchableOpacity>
        {isTranslated && (
        <><Text style={styles.label}>🇬🇧 Translation</Text><Text style={styles.result}>
            {result}
         </Text>
        <TouchableOpacity style={styles.button} onPress={saveAdd}>
            <Text style={{ color: '#fff', fontFamily: 'Archivo_Black' }}>
                Save & add
            </Text>
        </TouchableOpacity></>
        )}
         {loading &&  (<ActivityIndicator size="large" color="#F06543"></ActivityIndicator>)}
        {/* <Button
          tabIndex="-1"
          title="x"
          onPress={(e) => deleteTranslation(translation)}
          variant="link"
        >
        </Button> */}
        </View>
  );
}
const styles = StyleSheet.create({
    container: {
        margin: 20,
    },
    button: {
        width: 180,
        borderRadius: 25,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#4845ed',
        flexDirection: 'row',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    label: {
        fontSize: 16
    },
    result: {
        // fontFamily: 'Archivo_Black',
        fontSize: 22,
        marginTop: 5,
        marginBottom: 5

    }
})
