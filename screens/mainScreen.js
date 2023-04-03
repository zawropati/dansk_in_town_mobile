import React, { useEffect, useState } from 'react';
import {
  StyleSheet, ImageBackground, Image, View, Text, Switch, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { Camera, CameraType } from 'expo-camera';
import CameraPreview from '../components/cameraPreview'
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const BuildingScreen = (props) => {
  const [startCamera, setStartCamera] = React.useState(false)
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [capturedImage, setCapturedImage] = React.useState(null)
  const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back)
  const [flashMode, setFlashMode] = React.useState('off')
  const [picked, setPicked] = useState(false)
  const navigation = useNavigation();

  const __startCamera = async () => {
    const {status} = await Camera.requestCameraPermissionsAsync()
    console.log(status)
    if (status === 'granted') {
      setStartCamera(true)
    } else {
      Alert.alert('Access denied')
    }
  }
  const __takePicture = async () => {
      const uri = await camera.takePictureAsync(CameraPictureOptions={base64: true})
      setPreviewVisible(true)
      setPicked(false)
      setCapturedImage(uri)
  }
  const __savePhoto = () => {
    setPreviewVisible(false)
    setStartCamera(false)
    setCapturedImage(null)
    navigation.navigate('Library',{ isNavigatedToPage: true })
  }

  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }
  const __close = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    setStartCamera(false)
  }
  const __handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('on')
    } else {
      setFlashMode('auto')
    }
  }
  const __switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front')
    } else {
      setCameraType('back')
    }
  }
  const goBack = () => {
    setStartCamera(false)

  }
  const goToPractice = () => {
    navigation.navigate('Practice')
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing:true
    });
    if (!result.cancelled) {
      setPreviewVisible(true)
      setPicked(true)
      setCapturedImage(result)
    }
  };
  return (
    <View style={styles.container}>
    {startCamera ? (
      <View
        style={{
          flex: 1,
          width: '100%'
        }}
      >
        {previewVisible && capturedImage ? (
          <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} close={__close} picked={picked}/>
        ) : (
          <Camera
            type={cameraType}
            flashMode={flashMode}
            style={{flex: 1}}
            ref={(r) => {
              camera = r
            }}
          >
            <View
              style={{
                flex: 1,
                width: '100%',
                backgroundColor: 'transparent',
                flexDirection: 'row'
              }}
            >
              <View
                style={{
                  position: 'absolute',
                  left: '5%',
                  top: '10%',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <TouchableOpacity
                  onPress={__handleFlashMode}
                  style={{
                    backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                    borderRadius: '50%',
                    height: 25,
                    width: 25
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20
                    }}
                  >
                    ⚡️
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={__switchCamera}
                  style={{
                    marginTop: 20,
                    borderRadius: '50%',
                    height: 25,
                    width: 25
                  }}
                >
                  <Text
                    style={{
                      fontSize: 20
                    }}
                  >
                    {cameraType === 'front' ? '🤳' : '📷'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  flexDirection: 'row',
                  flex: 1,
                  width: '100%',
                  padding: 20,
                  justifyContent: 'space-between'
                }}
              >
                <View
                  style={{
                    alignSelf: 'center',
                    flex: 1,
                    alignItems: 'center'
                  }}
                >
                  <TouchableOpacity
                    onPress={__takePicture}
                    style={{
                      width: 70,
                      height: 70,
                      bottom: 0,
                      borderRadius: 50,
                      backgroundColor: '#fff'
                    }}
                  />
                  <TouchableOpacity
                    title
                    onPress={goBack}
                    style={{
                      width: 100,
                      height: 40,
                      left: 0,
                      bottom: 0,
                      position: 'absolute',
                      borderRadius: 25,
                      backgroundColor: "#4845ed",
                    }}
                  >
                  <Text
                  style={{
                    lineHeight: 40,
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily: 'Archivo',
                    }}
                  >
                  ← Go back
                  </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    title
                    onPress={pickImage}
                    style={{
                      width: 100,
                      height: 40,
                      right: 0,
                      bottom: 0,
                      position: 'absolute',
                      borderRadius: 25,
                      backgroundColor: "#F06543",
                    }}
                  >
                  <Text
                  style={{
                    lineHeight: 36,
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontFamily: 'Archivo',
                    }}
                  >
                  🖼 Select
                  </Text>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </Camera>
        )}
      </View>
    ) : (
      <>
      <View style={{height: 300, width: 300, justifyContent: 'center', alignSelf: 'center'}}>
        <Image style={{ alignSelf: 'center', flex: 1, width: '100%', resizeMode: 'contain'}}
        source={require('../assets/DanskInTown2.png')}></Image>
      </View>
      <View style={{height: 700, width: 450, justifyContent: 'center', alignSelf: 'center'}}>
        <ImageBackground style={styles.image2} source={require('../assets/graph(4).png')}>
          <Text style={styles.introText}>
            {/* Understand the world around you{"\n"} */}
          Do you live in Denmark?  🇩🇰{"\n"}{"\n"} Wouldn't it be nice if you would understand at least the danish on the signs you see around town?{"\n"}{"\n"}
          Start taking pictures, build your dictionary and learn through the translations!
          {/* Practice Danish vocabulary based on photos taken around town. Either use the public photo set that we created by walking everywhere around town, or upload and practice with your own photos. Tip: When uploading your own you get automatic translations too! */}
          </Text>
        {/* <ImageBackground style={styles.image} source={require('../assets/graph(3).png')} resizeMode="cover"> */}
        {/* </ImageBackground> */}
      <View style={styles.practiceBox}>
        {Parse.User.current() && (
        <TouchableOpacity
          onPress={__startCamera}
          style={{
            backgroundColor: "#4845ed",
            width: 250,
            alignSelf: 'center',
            marginBottom: 10,
            padding: 10,
            borderRadius: 24,
          }}
        >
          <Text
            style={{
              fontFamily: 'Archivo_Black',
              fontSize: 24,
              textAlign: 'center',
              color: 'white'
            }}
          >
            Take picture
          </Text>
        </TouchableOpacity>
        )}
        {!Parse.User.current() && (
        <TouchableOpacity
          onPress={__startCamera}
          style={{
            backgroundColor: "#4845ed",
            width: 250,
            alignSelf: 'center',
            marginBottom: 10,
            padding: 10,
            borderRadius: 24,
          }}
        >
          <Text
            style={{
              fontFamily: 'Archivo_Black',
              fontSize: 24,
              textAlign: 'center',
              color: 'white'
            }}
          >
            Sign up
          </Text>
        </TouchableOpacity>
        )}
        {/* <TouchableOpacity
            onPress={goToPractice}
            style={{
              backgroundColor: "#F06543",
              width: 250,
              alignSelf: 'center',
              padding: 10,
              borderRadius: 24,
            }}
            >
            <Text
              style={{
                color: 'white',
                fontFamily: 'Archivo_Black',
                fontSize: 24,
                textAlign: 'center'
              }}
            >
            Read more
            </Text>
        </TouchableOpacity> */}
      </View>
      </ImageBackground>
      </View>
      </>
    )}
  </View>
)
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  flexDirection: 'column',
  backgroundColor: '#F9F5FF'
},
image: {
  flex: 1,
  resizeMode: 'cover',
  top: 250
},
image2: {
  width: '100%',
  height: '100%',
  flex: 1,
  resizeMode: 'cover',
  top: -310,
},
introText: {
  fontSize: 24,
  width: '80%',
  color: 'white',
  fontFamily: 'Archivo',
  alignSelf: 'center',
  textAlign: 'center',
  fontWeight: 'bold',
  position: 'absolute',
  top: 250
},

practiceBox: {
  top: 530,
  width: '100%',
}
})

export default BuildingScreen;
