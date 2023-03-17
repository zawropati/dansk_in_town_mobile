import React, { useEffect, useState } from 'react';
import {
  StyleSheet, ScrollView, ActivityIndicator, View, Text, Switch, TouchableOpacity
} from 'react-native';
import PropTypes from 'prop-types';
import { Camera, CameraType } from 'expo-camera';
import CameraPreview from '../components/cameraPreview'

// import { useSelector } from 'react-redux';
// import { translate } from '../assets/translations/translationsHandler';
// import Card from '../components/card';
// import PercentageBar from '../components/percentageBar';
// import DonutChart from '../components/donutChart';
// import SmartMe from '../components/smartme';

// import colors from '../constants/colors';

const BuildingScreen = (props) => {
  const [startCamera, setStartCamera] = React.useState(false)
  const [previewVisible, setPreviewVisible] = React.useState(false)
  const [capturedImage, setCapturedImage] = React.useState(null)
  const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back)
  const [flashMode, setFlashMode] = React.useState('off')

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
    const photo = await camera.takePictureAsync()
    console.log(photo)
    setPreviewVisible(true)
    //setStartCamera(false)
    setCapturedImage(photo)
  }
  const __savePhoto = () => {}
  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
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
          <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
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
                      right: 0,
                      bottom: 0,
                      position: 'absolute',
                      borderRadius: 25,
                      backgroundColor: '#14274e'
                    }}
                  >
                  <Text
                  style={{
                    lineHeight: 40,
                    color: '#fff',
                    fontWeight: 'bold',
                    textAlign: 'center'
                    }}
                  >
                  Go back
                  </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Camera>
        )}
      </View>
    ) : (
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity
          onPress={__startCamera}
          style={{
            width: 180,
            borderRadius: 25,
            backgroundColor: '#14274e',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40,
            marginBottom: 10,
            padding: 10,

          }}
        >
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
          📸 Take picture
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={__startCamera}
          style={{
            width: 180,
            borderRadius: 25,
            padding: 10,
            backgroundColor: '#14274e',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 40
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
          🖼 Select from photos
          </Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
)
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center'
}
})

export default BuildingScreen;
