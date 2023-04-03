import React, { useEffect, useState } from 'react';
import {
  ImageBackground, View, Text, TouchableOpacity
} from 'react-native';
import Translation from './translation.js';
import { uploadImageAndWords} from "../calls/db.js";
import * as FileSystem from 'expo-file-system';

export default function CameraPreview ({photo, retakePicture, savePhoto, close, picked}) {
  const [translations, setTranslations] = useState([
    { id: generateUID(), to: "", from: "" },
  ]);

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
      <View>
      <View
        style={{
          backgroundColor: 'transparent',
          width: '70%',
          height: '60%',
          alignSelf: 'center',
          resizeMode: 'contain',
          marginTop: 20
        }}
      >
        <ImageBackground
            source={ !picked ? {uri: photo && photo.uri } : source={uri:photo.uri} }
            style={{
            flex: 1,
            width: '100%',
            height: '100%',
            alignSelf: 'center',
            resizeMode: 'contain'
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              padding: 15,
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
                  width: 130,
                  height: 40,

                  alignItems: 'center',
                  borderRadius: 4
                }}
              >
                <Text
                  style={{
                    color: '#fff',
                    fontSize: 20
                  }}
                >
                  Re-take
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={close}
                style={{
                  width: 130,
                  height: 40,

                  alignItems: 'center',
                  borderRadius: 4
                }}
              >
                <Text
                  style={{
                    color: '#fff',
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
