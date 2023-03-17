import React, { useEffect, useState } from 'react';
import { getTranslationsForExercises } from "../calls/db.js";
// import { Link } from "react-router-dom";
import {
    StyleSheet, ScrollView, ActivityIndicator, View, Text, Switch, Image, Button, Pressable
  } from 'react-native';

import ImageCard from "../components/ImageCard";
import { counterEvent } from 'react-native/Libraries/Performance/Systrace.js';

const TranslationScreen = (props) => {
    const [translation, setTranslation] = useState();
    const [showingSolution, setShowingSolution] = useState(false);

    useEffect(() => {
      getRandomTranslation();
    }, []);

    function getRandomTranslation() {
      setTranslation();
      getTranslationsForExercises().then((translations) => {
        const randomWord = translations[Math.floor(Math.random() * translations.length)];
        setTranslation(randomWord);
      });
    }

    const handleTooEasy = function () {
      tooEasy(translation).then(() => {
        console.log("saved");

        getRandomTranslation();
        // window.location.reload(false);
      });
    }

    function handleNext() {
      setShowingSolution(false);
      getRandomTranslation();
    }

    if (!translation) {
      return <Text> Loading .. </Text>;
    }

    return (
        <View tyle={{alignItems: 'center', alignSelf: 'center'}}>
          <Image alt="" style={{width:300, height:300, alignSelf: 'center', margin: 20}} src={translation.get("image").get("file").url()} />
        <Text>
          {translation.get("from")}
        </Text>
        <Text>
          {showingSolution ? translation.get("to") : "?"}
        </Text>

        <View style={{alignItems: 'center', alignSelf: 'center'}}>
          {showingSolution ? (
              <Pressable onClick={handleNext}>
                <Text>
                Next
                </Text>
                </Pressable>
          ) : (
              <><Pressable
                style={{
                    width: 180,
                    borderRadius: 25,
                    padding: 10,
                    backgroundColor: '#14274e',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 40
                }} onPress={handleTooEasy} variant="secondary">
                <Text style={{color: '#fff'}}>
                    Too Easy
                </Text>
                </Pressable>
                <Pressable
                style={{
                    width: 180,
                    borderRadius: 25,
                    padding: 10,
                    backgroundColor: '#14274e',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 40
                }} onPress={() => setShowingSolution(true)}
                >
                <Text style={{color: '#fff'}}>
                    Show Solution
                </Text>
                </Pressable></>
          )}
        </View>
      </View>
    );
  }
export default TranslationScreen;
