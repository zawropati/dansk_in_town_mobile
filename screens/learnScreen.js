import React, { useEffect, useState } from 'react';
import {
  StyleSheet, ScrollView, ActivityIndicator, View, Text, Switch, Image
} from 'react-native';
import ImageCard from "../components/ImageCard";
import { getTranslations } from "../calls/db.js";

const LearnScreen = (props) => {
    const [imagesAndTranslations, setImagesAndTranslations] = useState();
    const [imageId2Url, setImageId2Url] = useState();
    const [imageIds, setImageIds] = useState([]);
    const [loading, setLoad] = useState(true);

    useEffect(() => {
        let mounted = true;
        const _imagesAndTranslations = {};
        const _imageId2Url = {};

        getTranslations().then((translations) => {
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
                setImageIds(imgs.slice(0,10))
                // console.log(imageId2Url)
            }
        // const imgs = (Object.keys(imagesAndTranslations))
        // setLoad(false)
    });
    return () => mounted = false;
    }, []);

    if (imageIds !== []) {
    content = (
        <ScrollView>
            <View
              >
            {imageIds.map((imageId) => (
                <View style={{
                  padding: 10,
                  flexDirection: 'row',

                }} key={imageId}>
                <ImageCard
                    imageId={imageId}
                    url={imageId2Url[imageId]}
                    words={imagesAndTranslations[imageId]}
                />
                </View>
            ))}
            </View>
            </ScrollView>
    );
    }else{
        content = (
            <Text>Loading...</Text>
        )
    }
    return content;
  }

export default LearnScreen;
