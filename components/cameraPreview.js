import React, { useEffect, useState } from 'react';
import {
  ImageBackground, View, Text, TouchableOpacity, Image
} from 'react-native';
import Translation from './translation.js';
import { uploadImageAndWords} from "../calls/db.js";
import * as FileSystem from 'expo-file-system';
import {useWindowDimensions} from 'react-native';

export default function CameraPreview ({photo, retakePicture, savePhoto, close, picked}) {
  const [translations, setTranslations] = useState([
    { id: generateUID(), to: "", from: "" },
  ]);
  const {windowHeight, windowWidth} = useWindowDimensions();

  function generateUID() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
  const [imageFile, setImageFile] = useState();
  const [isUploading, setIsUploading] = useState(false);

  async function handleUpload(e) {
    setIsUploading(true);
    const photoFileInfo = await FileSystem.getInfoAsync(photo.uri);
    const photoBase64 = await FileSystem.readAsStringAsync(photo.uri, { encoding: FileSystem.EncodingType.Base64 });

    await uploadImageAndWords(photoFileInfo, photoBase64, translations);
    savePhoto(true)
    // navigate("/myimages");
  }

  function handleFileUpload(e) {
    setImageFile(e.target.files[0]);
  }

  function addNewTranslation() {
    setTranslations([...translations, { id: generateUID(), to: "", from: "" }]);
  }

  function setFrom(translation, newValue) {
    const updatedList = translations.map((t) =>
      t.id !== translation.id
        ? t
        : { id: translation.id, from: newValue, to: translation.to }
    );

    setTranslations(updatedList);
  }

  function setTo(translation, newValue) {
    const updatedList = translations.map((t) =>
      t.id !== translation.id
        ? t
        : { id: translation.id, from: translation.from, to: newValue }
    );
    setTranslations(updatedList);
    handleUpload();
  }

  function deleteTranslation(translation) {
    setTranslations(translations.filter((t) => t.id !== translation.id));
  }
    return (
      <View style={{height: windowHeight}}>
      <View
        style={{
          backgroundColor: 'transparent',
          width: '100%',
          height: '50%',
          alignSelf: 'center',
          marginTop: 20
        }}
      >
        <ImageBackground
            resizeMode= 'contain'
            source={ !picked ? {uri: photo && photo.uri } : source={uri:photo.uri} }
            style={{
            flex: 1,
            width: '100%',
            height: '100%',
            alignSelf: 'center',
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}
            >
              <TouchableOpacity
                onPress={retakePicture}
                style={{
                  width: 120,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 4
                }}
              >
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20
                  }}
                >
                  Re-take
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={close}
                style={{
                  width: 120,
                  alignItems: 'center',
                  borderRadius: 4
                }}
              >
                <Text
                  style={{
                    color: 'black',
                    fontSize: 20
                  }}
                >
                  Close
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </ImageBackground>
        </View>
        <View style={{height:'30%'}}>
          {translations.map((translation) => (
            <Translation
              key={translation.id}
              translation={translation}
              setFrom={setFrom}
              setTo={setTo}
              deleteTranslation={deleteTranslation}
            />
          ))}
        </View>
      </View>
    )
  }
