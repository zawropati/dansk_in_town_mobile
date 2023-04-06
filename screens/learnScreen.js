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
    const [isSeeTranslations, seeTranslations] = useState(false);
    const isFocused = useIsFocused()
    const navigation = useNavigation();

    useEffect(() => {
        let mounted = true;
        const _imagesAndTranslations = {};
        const _imageId2Url = {};

        getTranslations().then((translations) => {
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
                setLoad(false)
            }
        });
        getLastWeekTranslations().then ((number) => {
            setLastWeek(number)
        })

        getAllTranslations().then((number) => {
            let digit = 0
            if (number <= 9){
                digit = 1
            }else{
                digit = Number(number.toString()[0]) + 1
            }
            setLevel(digit);
            if (number <= digit * 10) {
                setMissing((digit) * 10 - number);
                setProgress(1 - ((digit) * 10 - number) / 10);
                } else {
                // If number > level * 10, move on to the next level
                    return;
                }
        })
    return () => mounted = false;
    }, [isFocused, isSeeTranslations]);

    const goToPractice = () => {
        // setPractice(true)
        navigation.navigate('Practice', {data: translationsAll, practiceFavourites: true})
    }

    const seeAll = () => {
        seeTranslations(!isSeeTranslations)
    }

    if (loading) {
        return (
        <View style={{  backgroundColor: '#F9F5FF', height: '100%', paddingTop: 10}}>
            <ActivityIndicator  size="large" color="#F06543"/>
        </View>
        )
    }

    return (
    <View>
        <><ScrollView style={{ backgroundColor: '#F9F5FF' }}>
        <View style={styles.overviewBox}>
            <Text style={styles.textLevel}>Level {level}</Text>
            <Text>{missingWords} words missing to achieve the next level!</Text>
            <View style={styles.progressBox}>
                {progress && (<ProgressBar color={'#F06543'} progress={progress} />)}
            </View>
            <View style={styles.boxes}>
                <Text style={styles.boxText}>Last week you added <Text style={{fontFamily: 'Archivo_Black'}}>{numberLastWeek}</Text> words!</Text>
                {/* <Text style={styles.boxText}>Others added 5 of your words to favourites</Text> */}
            </View>
        </View>
        <View style={{ marginTop: 10 }}>
            <View
                style={{
                    width: '90%', display: 'flex', flexDirection: 'row', justifyContent:'space-between', padding: 2, marginLeft: 20
                }}
            >
                <View style={{
                     display: 'flex', flexDirection: 'row'}}>
                    <Ionicons size={25} color='#F06543' name='heart' />
                    <Text style={{ fontSize: 16, paddingTop: 3 }}>Your images</Text>
                </View>
                <Pressable style={styles.buttonSeeAll} onPress={seeAll} variant="primary" type="submit">
                    {!isSeeTranslations && (<><Ionicons size={25} color='#F06543' name='checkmark' /><Text style={styles.buttonTextAll}> See translations</Text></>)}
                    {isSeeTranslations && (<><Ionicons size={25} color='#F06543' name='close' /><Text style={styles.buttonTextAll}> Hide translations</Text></>)}
                </Pressable>
            </View>

            {imageIds.map((imageId) => (
            <View key={imageId}>
                <ImageCard
                    imageId={imageId}
                    url={imageId2Url[imageId]}
                    words={imagesAndTranslations[imageId]}
                    seeTranslations={isSeeTranslations} />
            </View>
            ))}
        </View>
        </ScrollView>
        <Pressable style={styles.button} onPress={goToPractice} variant="primary" type="submit">
            <Text style={styles.buttonText}> Practice your library →</Text>
        </Pressable></>
    </View>
    );
  }
const styles = StyleSheet.create({
  overviewBox: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: true,
    //   width: '90%',
      alignSelf: 'center',
      justifyContent:'center',
      padding: 10,
      paddingBottom: 20,
      marginBottom: 10,
      height: 150,
      marginTop: 10,
      borderBottomWidth: '2px solid',
      borderBottomColor: '#F06543',
    //   backgroundColor: 'white',
    //   borderRadius: 10,
  },
  textLevel: {
    fontSize: 24,
    marginBottom: 5,
    width: '100%',
    fontFamily: 'Archivo_Black',
    textAlign: 'center'
  },
  boxes: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center'
  },
  boxText: {
    // padding: 15,
    marginTop: 20,
    fontSize: 16,
    width: '50%',
    textAlign: 'center'
  },
  progressBox: {
    marginTop: 10,
    // width: '100%'
    // height: 20
  },
  button: {
    backgroundColor: '#4845ed',
    width: 220,
    alignSelf: 'center',
    padding: 10,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems:'center',
    position: 'absolute',
    bottom: 20,
    right: 20
},
buttonSeeAll: {
    display: 'flex',
    justifyContent: 'center',
    alignItems:'center',
    flexDirection: 'row',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 50,
    width: 170,
    padding: 1,
    marginBottom: 2
},
buttonText: {
    color: 'white',
    fontFamily: 'Archivo_Black'
},
buttonTextAll: {
    color: 'black',
    fontFamily: 'Archivo',
    fontSize: 16,
    textAlign: 'center',
}
});

export default LearnScreen;
