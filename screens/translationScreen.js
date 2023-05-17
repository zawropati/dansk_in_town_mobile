import React, { useEffect, useState } from 'react';
import { getTranslationsForExercises, checkIfFavourite, addEvent, getOptionsAnswers, getStrike, handleStrike } from "../calls/db.js";
// import { Link } from "react-router-dom";
import {
    StyleSheet, ScrollView, View, Text, Image, TouchableOpacity, ActivityIndicator, Modal
  } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import {useWindowDimensions} from 'react-native';


const TranslationScreen = () => {
    const [translation, setTranslation] = useState();
    const [isFavourite, setFavourite] = useState(false);
    const [wrongs, setWrongs] = useState();
    const [state, setIndex] = useState(-1);
    const [word, setWord] = useState();
    const [practiceFavourites, setPractice] = useState(false)
    const [transData, setData] = useState()
    const [loading, setLoading] = useState(false)
    const {windowHeight, windowWidth} = useWindowDimensions();
    const [color, setColor] = useState('#40F99B')
    const [correct, setCorrect ] = useState()
    const [loadingImage, setLoadedImage] = useState(false);
    const [days, setDays] = useState();
    const [dailyCorrect, setDailyCorrect] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);


    const route = useRoute();

    useEffect(() => {
      if (route.params) {
        const { data, practiceFavourites } = route.params;
        setData(data)
        setPractice(true)
        handleFavourties(data);
      }else{
        getRandomTranslation();
      }
      checkStrike()
    }, [route.params]);

    const checkStrike = function(){
      getStrike().then((result)=>{
        if(result !== 0){
          setDailyCorrect(result.correctAnswersCount)
          setDays(result.strikeDays)
        }else{
          setDays(result)
          setDailyCorrect(0)
        }
      })
    }
    // useEffect(() => {
    //   getRandomTranslation();
    // }, [practiceFavourites]);

    function getRandomTranslation(practice, data) {
        setLoading(true)
        getTranslationsForExercises().then((translations) => {
          const correctWord = translations[Math.floor(Math.random() * translations.length)];
          setWord(correctWord)
          if(correctWord === undefined){
            getOptionsAnswers(word).then((results) => {
              let imageId = word.get("image").id
              let userId = Parse.User.current().id
              checkIfFavourite(imageId, userId).then((res) =>{
                setFavourite(res)
              })
              results.push(word.get("to").toLowerCase())
              setCorrect(null)
              setIndex(-1)
              shuffleArray(results)
              setWrongs(results)
              setTranslation(word)
              setLoading(false)
            })
          }else{
            getOptionsAnswers(correctWord).then((results) => {
              let imageId = correctWord.get("image").id
              let userId = Parse.User.current().id
              checkIfFavourite(imageId, userId).then((res) =>{
                setFavourite(res)
              })
              results.push(correctWord.get("to").toLowerCase())
              setCorrect(null)
              setIndex(-1)
              shuffleArray(results)
              setWrongs(results)
              setTranslation(correctWord)
              setLoading(false)
            })
          }
        });
      }

    function handleFavourties(data) {
      const correctWord = data[Math.floor(Math.random() * data.length)];
        getOptionsAnswers(correctWord).then((results) => {
          results.push(correctWord.get("to").toLowerCase())
          shuffleArray(results)
          setWrongs(results)
          setTranslation(correctWord)
          setLoading(false)

        })
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

    const pickTile = function (e, index) {
      setWord(e)
      setIndex(index)
      setTimeout(() => {
        if(e.toLowerCase() == translation.get('to').toLowerCase()){
          // addEvent('correctAnswer', translation.id)
          // setIndex(-1);
          saveStrike()
          setCorrect(true)
          if(!practiceFavourites){
            //
          }else{handleFavourties(transData)}
          }else{
              // addEvent('wrongAnswer', translation.id)
              // setIndex(-1);
              setCorrect(false)
            }
            setTimeout(() => {
              getRandomTranslation()
            }, 1500);
        }, 1000);

  }
  const saveStrike = function (){
    handleStrike(days).then((strike)=>{
      setDailyCorrect(strike.get('correctAnswersCount'))
      if(strike.get('correctAnswersCount') == 10){
        setTimeout(() => {
          setIsModalVisible(true);
        }, 2000);
      }
      setDays(strike.get('strikeDays'))
    })
  }
  const exitFavourites = function (){
    setPractice(false)
    getRandomTranslation(false);
  }
  const toggleModal = function (){
    setIsModalVisible(!isModalVisible)
  }

  return (
    <View style={{  backgroundColor: '#FFFDFB', height: windowHeight, flex: 1}}>
      {/* <TouchableOpacity onPress={toggleModal}><Text>click</Text></TouchableOpacity> */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={toggleModal}
      >
        <View style={styles.popupBox}>
        <Ionicons name={'flame'} size={70} color={'#F06543'}/>
          <Text style={{...styles.popupText, fontSize: 50, marginBottom:20}}> day {days}</Text>
          <Text style={styles.popupText}>Congrats!</Text>
          <Text style={styles.popupTextSmall}>Streak mode activated! Maintain your progress by getting 10 phrases correctly every day. </Text>
          <TouchableOpacity style={styles.button} onPress={toggleModal}><Text style={styles.popupBtnText}>Close</Text></TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.strikeBox}>
        <View style={styles.strikeBoxOne}><Text  style={styles.strikeText}>daily streak</Text><Ionicons name={'flame'} size={25} color={'#F06543'}></Ionicons><Text style={{ ...styles.strikeText, fontSize: 20}}>{days}</Text></View>
        <View style={styles.strikeBoxOne}><Text  style={styles.strikeText}>correct today</Text><Ionicons name={'checkmark-circle'} size={25} color={'#2ae284'}></Ionicons><Text style={{ ...styles.strikeText, fontSize: 20}}>{dailyCorrect}</Text></View>
      </View>
    { (!loading && translation) ? (
      <><View style={{
          alignItems: 'center', height: '55%', width: '100%', paddingTop: 10,
          paddingBottom: 10,
          borderBottomWidth: 2,
          borderStyle: 'solid',
          borderBottomColor: '#F06543',
        }}>
          <Image alt=""
            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
            src={translation.get("image").get("file").url()}
            onLoad={() => setLoadedImage(true)} />
                  {practiceFavourites && (<TouchableOpacity
        style={{
          backgroundColor: '#ffffff', alignSelf: 'center',
          borderRadius: 50, width: 180, display: 'flex',
          flexDirection: 'row', padding: 1, position: 'absolute',
          zIndex:100, marginTop: 15, justifyContent: 'center',
        }}
          onPress={() => exitFavourites()} variant="secondary"
        >
        <Ionicons size={25} color='#F06543' name='close-outline'/>
        <Text style={{fontSize: 16, paddingTop: 3}}>Exit library mode</Text>
      </TouchableOpacity>)}
        </View><ScrollView style={{ marginTop: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 22, fontFamily: 'Archivo_Black', fontWeight: 200, marginBottom: 5 }}>
              {translation.get("from")}
            </Text>
            <View style={styles.wordContainer}>
              {wrongs.map((e, index) => (
                <TouchableOpacity key={index}
                  style={{
                    backgroundColor: state === index && correct ? "#2ae284" : state === index && correct === false ? "red" : "#F3F3FF",
                    borderWidth: state === index ? 2 : 0,
                    margin: 5,
                    paddingBottom: 25,
                    paddingTop: 25,
                    paddingLeft: 10,
                    paddingRight: 10,
                    // flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '45%',
                    textAlign: 'center',
                    borderRadius: 5,
                    transition: '1s ease-in-out',
                  }}
                  onPress={() => pickTile(e, index)} variant="secondary"
                >
                  <Text style={{ textAlign: 'center', fontSize: 18, fontFamily: 'Archivo', fontWeight: 200, }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView></>
      ) : (
        <View style={{  backgroundColor: '#FFFDFB', height: '100%', paddingTop: 10}}>
        <ActivityIndicator  size="large" color="#F06543"/>
      </View>
      )}
        </View>
        );
      }

const styles = StyleSheet.create({
  wordContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'row',
      marginBottom: 15,
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
      backgroundColor: "white",
      padding: 10,
      width: 100,
      borderRadius: 20,
      alignItems: 'center',
      margin: 20
  },
  text: {
      textAlign: 'center',
      fontSize: 20,
      color: 'white',
  },
  strikeBox:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#FFF8F1',
    padding: 5
    // verticalAlign: 'center',
  },
  strikeText: {
    fontFamily: 'Archivo_Black',
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    fontSize: 12,
    alignSelf: 'center',
    justifyContent: 'center', //Centered vertically
  },
  popupBox: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4845ed' },
  popupText: {
    fontFamily: 'Archivo_Black',
    fontSize: 26,
    color: 'white',
    padding: 10
  },
  popupTextSmall: {
    textAlign: 'center',
    paddingHorizontal: 40,
    paddingVertical: 10,
    fontFamily: 'Archivo',
    fontSize: 20,
    color: 'white'
  },
  popupBtnText: {
    fontFamily: 'Archivo_Black',
    fontSize: 14,
    color: 'black',
  },
  strikeBoxOne: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10
  }
});

export default TranslationScreen;
