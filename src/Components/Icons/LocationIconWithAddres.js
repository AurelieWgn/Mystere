import React from 'react';
import {View, Image, Text} from 'react-native';

const LocationIconWithAddres = ({addres}) => {
  return (
    <View style={{display: 'flex', flexDirection: 'row', maxWidth: '98%'}}>
      <View style={{margin: 3, marginLeft: 0}}>
        <Image
          source={require('../../Img/Places/red_place.png')}
          style={{width: 16, height: 16}}
        />
      </View>
      <Text style={{color: '#F3E0E2', fontWeight: '600', fontSize: 14}}>
        {addres}
      </Text>
    </View>
  );
};

export default LocationIconWithAddres;
