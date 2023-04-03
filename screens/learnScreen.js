import React, { useEffect, useState } from 'react';
import {
  StyleSheet, ScrollView, ActivityIndicator, View, Text, Switch, Image, Pressable
} from 'react-native';
import ImageCard from "../components/ImageCard";
import { getTranslations, getLastWeekTranslations, getAllTranslations } from "../calls/db.js";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Parse from 'parse/react-native.js';
import { useIsFocused } from '@react-navigation/native'
import ProgressBar from 'react-native-progress/Bar';
import { useNavigation } from '@react-navigation/native';
import Practice from '../components/practice'

const LearnScreen = ({  }) => {
    const [imagesAndTranslations, setImagesAndTranslations] = useState();
    const [translationsAll, setTranslations] = useState();
    const [imageId2Url, setImageId2Url] = useState();
    const [imageIds, setImageIds] = useState([]);
    const [loading, setLoad] = useState(true);
    const [numberLastWeek, setLastWeek] = useState();
    const [progress, setProgress] = useState();
    const [level, setLevel] = useState(0);
    const [missingWords, setMissing] = useState(0);
    const [practiceFavourites, setPractice] = useState(false);
    const isFocused = useIsFocused()
    const navigation = useNavigation();

    useEffect(() => {
        let mounted = true;
        const _imagesAndTranslations = {};
        const _imageId2Url = {};

        getTranslations().then((translations) => {
            console.log('translationsAll')
            console.log(translationsAll)
            setTranslations(translations)
            if(mounted) {
                translations.forEach((t) => {
                const imageId = t.get("image").id;
                const imageURL = t.get("image").get("file").url();

                if (!_imagesAndTranslations[imageId]) {
                    _imagesAndTranslations[imageId] = [];
                    _imageId2Url[imageId] = imageURL;
                }
                _imagesAndTranslations[imageId].push(t);
            });
                setImagesAndTranslations(_imagesAndTranslations);
                setImageId2Url(_imageId2Url);
                const imgs = Object.keys(_imagesAndTranslations).reverse()
                setImageIds(imgs)
            }
        });
        getLastWeekTranslations().then ((number) => {
            setLastWeek(number)
        })
        //needs to be automated
        getAllTranslations().then ((number) => {
            console.log(number)
            if (number <= 10){
                setLevel(1)
                setMissing(10-number)
                setProgress((10-number)/10)
            }else if (number > 10 && number <= 20){
                setLevel(2)
                setMissing(20-number)
                setProgress((20-number)/10)
            }else{
                setLevel(3)
            }
            console.log(progress)
        })

    return () => mounted = false;
    }, [isFocused]);

    const goToPractice = () => {
        // setPractice(true)
        navigation.navigate('Practice', {data: translationsAll, practiceFavourites: true})
    }
    if (imageIds !== [] && Parse.User.current()) {
        content = (
            <View>
                {/* {practiceFavourites ? ( */}
                    {/* <Practice data={translationsAll}></Practice> */}
                {/* ) :( */}
                <><ScrollView style={{ backgroundColor: '#F9F5FF' }}>
                            <View style={styles.overviewBox}>
                                <Text style={styles.textLevel}>Level {level}</Text>
                                <Text>{missingWords} words missing to achieve the next level!</Text>
                                <View style={styles.progressBox}>
                                    {progress && (<ProgressBar color={'#F06543'} progress={progress} />)}
                                </View>
                                <View style={styles.boxes}>
                                    <Text style={styles.boxText}>Last week you added {numberLastWeek} words!</Text>
                                    <Text style={styles.boxText}>Others added 5 of your words to favourites</Text>
                                </View>
                            </View>
                            <View style={{ marginTop: 15 }}>
                                <View
                                    style={{
                                        width: '80%', display: 'flex', flexDirection: 'row', padding: 1
                                    }}
                                >
                                    <Ionicons size={25} color='#F06543' name='heart' />
                                    <Text style={{ fontSize: 16, paddingTop: 3 }}>Your favourites</Text>
                                </View>
                                {imageIds.map((imageId) => (
                                    <View key={imageId}>
                                        <ImageCard
                                            imageId={imageId}
                                            url={imageId2Url[imageId]}
                                            words={imagesAndTranslations[imageId]} />
                                    </View>
                                ))}
                            </View>
                        </ScrollView><Pressable style={styles.button} onPress={goToPractice} variant="primary" type="submit">
                                <Text style={styles.buttonText}> Practice favourites →</Text>
                            </Pressable></>

                {/* )} */}
        </View>
    );
    }else{
        content = (
            <Text>Log in to see your library</Text>
        )
    }
    return content;
  }
const styles = StyleSheet.create({
  overviewBox: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: true,
      width: '90%',
      alignSelf: 'center',
      justifyContent:'center',
      padding: 10,
      paddingBottom: 20,
      marginBottom: 10,
      height: 150,
      marginTop: 10,
      borderBottomWidth: '2px solid',
      borderBottomColor: '#F06543',
      backgroundColor: '#FFF8F1',
    //   borderRadius: 10,
  },
  textLevel: {
    fontSize: 24,
    fontFamily: 'Archivo_Black',
    alignSelf: 'center'
  },
  boxes: {
    display: 'flex',
    flexDirection: 'row',
  },
  boxText: {
    padding: 15,
    fontSize: 16,
    width: '50%',
    textAlign: 'center'
  },
  progressBox: {
    marginTop: 10
    // height: 20
  },
  button: {
    backgroundColor: '#4845ed',
    width: 200,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems:'center',
    position: 'absolute',
    bottom: 20,
    right: 20
},
buttonText: {
    color: 'white',
    fontFamily: 'Archivo_Black'
}
});

export default LearnScreen;
