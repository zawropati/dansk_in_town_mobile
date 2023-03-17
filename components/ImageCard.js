import React, { useEffect, useState } from 'react';
import {
    View, Text, Image
  } from 'react-native';
export default function ImageCard({ imageId, url, words }) {
   const [showValue, setShowValue] = useState();
  return (
      <View style={{ }}>
        {/* <SectionList className="list-group-flush"> */}
          {words.map((e) => (
            <View style={{alignSelf: 'left', display: 'flex', flexDirection: 'row', margin: 10}} key={e.id}>
              <Image style={{height: 100, width: 100, padding: 15, alignSelf: 'center'}} source={{uri: url}}></Image>
              <Text style={{margin: 10, fontSize: 14}}>{e.get("from")}</Text>
              {/* <Button onPress={() => setShowValue(!showValue)} title='Translate'>
              </Button> */}
              {showValue&& <Text>{e.get("to")}</Text>}
            </View>
          ))}
        {/* </SectionList> */}
      </View>
  );
}
