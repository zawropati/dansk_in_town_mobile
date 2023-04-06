import React, { useEffect, useState } from 'react';
import { getTranslationsForExercises, tooEasy, addToFavourites, checkIfFavourite, addEvent } from "../calls/db.js";
// import { Link } from "react-router-dom";
import {
    StyleSheet, ImageBackground, View, Text, Image, Pressable, ActivityIndicator,
  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { User } from 'parse/react-native.js';
import { useRoute } from '@react-navigation/native';
import {useWindowDimensions} from 'react-native';


const TranslationScreen = () => {
    const [translation, setTranslation] = useState();
    const [isFavourite, setFavourite] = useState(false);
    const [wrongs, setWrongs] = useState();
    const [state, setIndex] = useState(-1);
    const [word, setWord] = useState();
    const [currentScore, setScore] = useState(0);
    const [practiceFavourites, setPractice] = useState(false)
    const [transData, setData] = useState()
    const [loading, setLoading] = useState(false)
    const {windowHeight, windowWidth} = useWindowDimensions();

    const route = useRoute();

    useEffect(() => {
      if (route.params) {
        const { data, practiceFavourites } = route.params;
        setData(data)
        setPractice(true)
        setData(data)
        handleFavourties(data);
      }else{
        getRandomTranslation();
      }
    }, [route.params]);

    // useEffect(() => {
    //   getRandomTranslation();
    // }, [practiceFavourites]);

    function getRandomTranslation(practice, data) {
        setLoading(true)
        getTranslationsForExercises().then((translations) => {
          const correctWord = translations[Math.floor(Math.random() * translations.length)];
          const wrongWords = []
          //need to think here about same words being added to the array
          for(var i = 0; i < 3; i++ ){
            wrongWords.push(translations[Math.floor(Math.random() * translations.length)])
          }

          let imageId = correctWord.get("image").id
          let userId = Parse.User.current().id
          checkIfFavourite(imageId, userId).then((res) =>{
            setFavourite(res)
          })
          wrongWords.push(correctWord)
          shuffleArray(wrongWords)
          setWrongs(wrongWords)
          setTranslation(correctWord)
          setLoading(false)
        });
      }

      function handleFavourties(data) {
        const correctWord = data[Math.floor(Math.random() * data.length)];
        const wrongWords = []

        for(var i = 0; i < 3; i++ ){
          wrongWords.push(data[Math.floor(Math.random() * data.length)])
        }
        wrongWords.push(correctWord)
        shuffleArray(wrongWords)
        setWrongs(wrongWords)
        setTranslation(correctWord)
        setLoading(false)

      }

    function shuffleArray (array) {
      for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
      return array;
    }

    const handleTooEasy = function () {
      tooEasy(translation).then(() => {
        if(!practiceFavourites){
          getRandomTranslation();
        }else{handleFavourties(transData)}
      });
    }

    const handleNext = function () {
        if(word.get('to') == translation.get('to')){
            addEvent('correctAnswer', translation.id)
            alert('Good!')
            setIndex(-1);
            setScore(currentScore + 1)
            if(!practiceFavourites){
              getRandomTranslation();
            }else{handleFavourties(transData)}
        }else{
            addEvent('wrongAnswer', translation.id)
            setIndex(-1);
            alert('Wrong!')
        }
    //   setShowingSolution(false);
    }

    const pickTile = function (e, index) {
        setIndex(index)
        setWord(e)
    }

	const addFavourites = function (){
		let imgId = translation.get('image').id
    let userId = User.current().id
    addToFavourites(imgId, userId)
	}

  const exitFavourites = function (){
    setPractice(false)
    getRandomTranslation(false);
  }
  if (!translation || loading) {
    return (
      <View style={{  backgroundColor: '#F9F5FF', height: '100%', paddingTop: 10}}>
        <ActivityIndicator  size="large" color="#F06543"/>
      </View>
    )
  }
  return (
    <View style={{  backgroundColor: '#F9F5FF', height: windowHeight, flex: 1}}>
      {practiceFavourites && (<Pressable
        style={{
          backgroundColor: '#ffffff', alignSelf: 'center',
          borderRadius: 50, width: 180, display: 'flex',
          flexDirection: 'row', padding: 1, position: 'absolute',
          zIndex:100, marginTop: 20, justifyContent: 'center',
        }}
          onPress={() => exitFavourites()} variant="secondary"
        >
        <Ionicons size={25} color='#F06543' name='close-outline'/>
        <Text style={{fontSize: 16, paddingTop: 3}}>Exit library mode</Text>
      </Pressable>)}
    <View style={{alignItems: 'center', height: '55%', width: '100%',paddingTop: 10,
      paddingBottom: 10,
      borderBottomWidth: '2px solid',
      borderBottomColor: '#F06543',
      }}>
      <Image alt="" style={{width: '100%', height: '100%', resizeMode: 'contain'}} src={translation.get("image").get("file").url()} />
      {/* <ImageBackground style={{width: 350, height: 300, resizeMode: 'contain', flex: 1}} source={require('../assets/graph(4).png')} resizeMode="cover"> */}
        {/* //  style={{resizeMode: 'contain', width:'75%', height:'75%', alignSelf: 'center', justifyContent:'center', marginTop: 20}} */}
        {/* </ImageBackground> */}
        <View style={{display: 'flex', padding: 10, flexDirection: 'row', textAlign: 'center'}}>
          {/* {isFavourite && !practiceFavourites && (<Pressable
          style={{
            backgroundColor: '#ffffff', borderRadius: 50, width: 160, display: 'flex', flexDirection: 'row', padding: 1}}
            onPress={() => addFavourites()} variant="secondary"
          >
            <Ionicons size={25} color='#F06543' name='add-outline'/>
            <Text style={{fontSize: 16, paddingTop: 3}}>Add to favourites</Text>
          </Pressable>)} */}
        </View>
      </View>
      <View style={{height: '40%',  marginTop: 20}}>
        <Text style={{textAlign: 'center', fontSize: 22, fontFamily: 'Archivo_Black', fontWeight: 200, marginBottom: 5}}>
          {translation.get("from")}
        </Text>
      <View style={styles.wordContainer}>
          {wrongs.map((e, index) => (
            <Pressable key={index}
            style={{
              backgroundColor: state === index ? '#40F99B' : 'white',
              margin: 5,
              paddingBottom: 20,
              paddingTop: 20,
              paddingLeft: 10,
              paddingRight: 10,
              // flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              width: '40%',
              textAlign: 'center',
              borderRadius: 5,
              transition: '1s ease-in-out',
              }}
            onPress={() => pickTile(e, index)} variant="secondary"
          >
              <Text style={{textAlign: 'center', fontSize: 18, fontFamily: 'Archivo', fontWeight: 200,}}>{e.get("to")}</Text>
              </Pressable>
          ))}
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
              <Pressable
              style={{
                  width: 160,
                  borderRadius: 25,
                  padding: 10,
                  backgroundColor: '#4845ed',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40,
                  margin: 5
              }} onPress={() => handleNext()}
              >
              <Text style={{color: '#fff', fontFamily: 'Archivo_Black'}}>
                  Check
              </Text>
              </Pressable>
              <Pressable
              style={{
                  width: 160,
                  borderRadius: 25,
                  padding: 10,
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: 40
              }} onPress={() => handleTooEasy()}
              >
              <Text style={{color: '#4845ed', fontFamily: 'Archivo_Black'}}>
                  Too easy
              </Text>
              </Pressable>
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wordContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginBottom: 15,
      flexWrap: true,
      justifyContent: 'center'
  },
  wordTile: {
      margin: 5,
      padding: 30,
      width: 150,
      textAlign: 'center',
      backgroundColor: '#FFF8F1',
      fontWeight: 600,
      fontFamily: 'Archivo_Black',
  },
  button: {
      backgroundColor: '#F06543',
      width: 200,
      padding: 10,
      borderRadius: 20,
      alignSelf: 'center',
  },
  text: {
      textAlign: 'center',
      fontSize: 20,
      color: 'white',
  }
});

export default TranslationScreen;
